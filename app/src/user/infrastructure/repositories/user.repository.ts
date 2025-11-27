import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { userSchema } from '../schemas/user.schema';
import {UserRow} from "../types/user-row.type";

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result: UserRow[] = await this.databaseService.database
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email));

    if (result.length === 0) {
      return null;
    }

    const u = result[0];

    return new UserEntity(
      u.id,
      u.email,
      u.passwordHash,
      u.createdAt,
      u.updatedAt,
    );
  }

  async create(email: string, passwordHash: string): Promise<UserEntity> {
    const result: UserRow[] = await this.databaseService.database
      .insert(userSchema)
      .values({ email, passwordHash })
      .returning();

    const u = result[0];

    return new UserEntity(
      u.id,
      u.email,
      u.passwordHash,
      u.createdAt,
      u.updatedAt,
    );
  }
}
