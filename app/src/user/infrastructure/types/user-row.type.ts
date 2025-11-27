import {InferSelectModel} from "drizzle-orm";
import {userSchema} from "../schemas/user.schema";

export type UserRow = InferSelectModel<typeof userSchema>