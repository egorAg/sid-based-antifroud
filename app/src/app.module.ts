import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserSidsModule } from './user-sids/user-sids.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    UserModule,
    AuthModule,
    UserSidsModule,
  ],
})
export class AppModule {}
