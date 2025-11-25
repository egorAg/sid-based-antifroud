// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { AppConfigService } from './config.service';
import { validateEnv } from './env/env.validation';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: ['.env.local', '.env'],
            validate: validateEnv,
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class ConfigModule {}
