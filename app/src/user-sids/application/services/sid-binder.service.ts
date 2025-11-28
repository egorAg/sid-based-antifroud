import { Injectable, Logger } from '@nestjs/common';
import { UserSidRepository } from '../../infrastructure/repositories/user-sid.repository';
import { RedisService } from '../../../redis/redis.service';
import { AppConfigService } from '../../../config/config.service';
import { ConfigVariables } from '../../../config/env/env.keys';

@Injectable()
export class SidBinderService {
  private readonly logger = new Logger(SidBinderService.name);

  constructor(
      private readonly repo: UserSidRepository,
      private readonly redis: RedisService,
      private readonly config: AppConfigService,
  ) {}

  public async bindSid(
      userId: number,
      sid: string,
      requestId?: string,
      isNewSid?: boolean,
  ): Promise<void> {
    const start = Date.now();
    const prefix = requestId ? `[${requestId}]` : '';

    try {
      if (isNewSid) {
        const key = `stateless:user:${userId}`;

        const hits = await this.redis.client.incr(key);
        await this.redis.client.expire(key, 60);

        if (hits <= 2) {
          this.logger.debug(`${prefix} First-time SID miss (#${hits}) for user=${userId}. Normal behavior.`,);
          return;
        }

        if (hits > 2) {
          this.logger.warn(`${prefix} Stateless behavior probably detected: user=${userId}, sid=${sid}, hits=${hits}`,);
          return;
        }

        /**
         * Здесь можно расписать логику обработки stateless пользователей:
         * 1. Замедление запросов
         * 2. Блокировка по ip
         * 3& Блокировка по userId
         * 4. Уведомление администрации etc
         */

        return;
      }

      const lockKey = `sid:bind:${userId}:${sid}`;
      const throttled = await this.redis.client.get(lockKey);

      if (throttled) {
        this.logger.debug(`${prefix} Throttled sid=${sid} for user=${userId}`);
        return;
      }

      await this.redis.client.set(lockKey, '1', {
        EX: this.config.get(ConfigVariables.SID_BIND_TTL),
      });

      const exists = await this.repo.exists(userId, sid);

      if (exists) {
        this.logger.debug(`${prefix} Exists sid=${sid} for user=${userId}`);
        return;
      }

      await this.repo.addSid(userId, sid);

      this.logger.log(`${prefix} Bound sid=${sid} to user=${userId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(
            `${prefix} Error binding sid=${sid} to user=${userId}: ${err.message}`,
            err.stack,
        );
      } else {
        this.logger.error(
            `${prefix} Unknown error in SidBind`,
            err,
        );
      }
    } finally {
      this.logger.debug(
          `${prefix} bindSid finished in ${Date.now() - start}ms`,
      );
    }
  }
}