import { InferSelectModel } from 'drizzle-orm';
import { userSidsSchema } from '../schemas/user-sid.schema';

export type UserSidRow = InferSelectModel<typeof userSidsSchema>;
