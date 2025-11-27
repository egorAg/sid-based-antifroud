import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { AppConfigService } from '../config/config.service';
import { ConfigVariables } from '../config/env/env.keys';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public readonly client: RedisClientType;

  constructor(private readonly config: AppConfigService) {
    const url = this.config.get(ConfigVariables.REDIS_URL);

    this.logger.log(`Connecting to Redis at: ${url}`);

    this.client = createClient({
      url,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error', err);
    });

    void this.client.connect();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      this.logger.log('Closing Redis connection');
      await this.client.quit();
    }
  }
}
