// import {
//     pgTable,
//     serial,
//     varchar,
//     integer,
//     timestamp,
//     boolean,
// } from 'drizzle-orm/pg-core';
// import { users } from './user.schema';
//
// export const userSids = pgTable('user_sids', {
//     id: serial('id').primaryKey(),
//
//     userId: integer('user_id')
//         .notNull()
//         .references(() => users.id, { onDelete: 'cascade' }),
//
//     sid: varchar('sid', { length: 255 }).notNull(),
//
//     hitCount: integer('hit_count').notNull().default(1),
//
//     createdAt: timestamp('created_at').defaultNow().notNull(),
//     lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
//
//     isBlocked: boolean('is_blocked').notNull().default(false),
// });
