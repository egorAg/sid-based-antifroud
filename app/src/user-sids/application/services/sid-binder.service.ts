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
  ): Promise<void> {
    const start = Date.now();
    const prefix = requestId ? `[${requestId}]` : '';

    try {
      const lockKey = `sid:bind:${userId}:${sid}`;

      const throttled = await this.redis.client.get(lockKey);

      if (throttled) {
        this.logger.debug(`${prefix} Throttled sid=${sid} for user=${userId}`);
        return;
      }

      await this.redis.client.set(lockKey, '1', {
        expiration: {
          type: 'EX',
          value: this.config.get(ConfigVariables.SID_BIND_TTL),
        },
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
          `[RequestId: ${requestId}] Unknown error in SidBin`,
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
