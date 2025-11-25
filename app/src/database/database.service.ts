import { Injectable, Logger } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';

import { AppConfigService } from '../config/config.service';
import * as schema from './schemas/index';
import {ConfigVariables} from "../config/env/env.keys";

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);

    private readonly client!: Sql<{}>;
    public db!: PostgresJsDatabase<typeof schema>;

    constructor(private readonly config: AppConfigService) {
        const url = this.config.get(ConfigVariables.DATABASE_URL);

        this.logger.log(`Connecting to Postgres at: ${url}`);

        this.client = postgres(url, {
            max: 10,
        });

        this.db = drizzle(this.client, { schema });

        this.logger.log(`Connected to Postgres at: ${url}`);
    }
}
