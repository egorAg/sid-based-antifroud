import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {EnvVars} from "./env/env.validation";
import {ConfigVariables} from "./env/env.keys";

@Injectable()
export class AppConfigService {
    private readonly logger = new Logger(AppConfigService.name);

    constructor(private readonly config: ConfigService<EnvVars, true>) {}

    get<T extends ConfigVariables>(key: T) {
        const value = this.config.get(key, { infer: true });

        if (value === undefined || value === null) {
            this.logger.error(`Config variable ${key} is missing!`);
        }

        return value;
    }
}
