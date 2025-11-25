import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import {DatabaseModule} from "./database/database.module";
import {RedisModule} from "./redis/redis.module";
import {UserModule} from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import {JwtMiddleware} from "./auth/infrastructure/middlewares/jwt.middleware";
import {RequestMergeMiddleware} from "./shared/middleware/request-merge.middleware";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMergeMiddleware, JwtMiddleware).forRoutes('*');
  }
}
