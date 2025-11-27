import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { userSchema } from '../../../user/infrastructure/schemas/user.schema';

export const userSidsSchema = pgTable(
  'user_sids',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => userSchema.id, { onDelete: 'cascade' }),
    sid: varchar('sid', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userSidUnique: unique('user_sid_unique').on(table.userId, table.sid),
  }),
);
