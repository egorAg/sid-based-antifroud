import { Injectable, ConflictException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { UserSidEntity } from '../../domain/entities/user-sid.entity';
import { userSidsSchema } from '../schemas/user-sid.schema';
import { DatabaseService } from '../../../database/database.service';
import { UserSidRow } from '../types/user-sid-row.type';

@Injectable()
export class UserSidRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapRow(row: UserSidRow): UserSidEntity {
    return new UserSidEntity(row.id, row.userId, row.sid, row.createdAt);
  }

  async findByUserId(userId: number): Promise<UserSidEntity[]> {
    const rows = await this.databaseService.database
      .select()
      .from(userSidsSchema)
      .where(eq(userSidsSchema.userId, userId));

    return rows.map((r) => this.mapRow(r));
  }

  async exists(userId: number, sid: string): Promise<boolean> {
    const rows = await this.databaseService.database
      .select()
      .from(userSidsSchema)
      .where(
        and(eq(userSidsSchema.userId, userId), eq(userSidsSchema.sid, sid)),
      );

    return rows.length > 0;
  }

  async addSid(userId: number, sid: string): Promise<UserSidEntity> {
    try {
      const res = await this.databaseService.database
        .insert(userSidsSchema)
        .values({
          userId,
          sid,
        })
        .returning();

      return this.mapRow(res[0]);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('user_sid_unique')) {
        throw new ConflictException('SID already bound for this user');
      }

      throw err;
    }
  }

  async findBySid(sid: string): Promise<UserSidEntity[]> {
    const rows = await this.databaseService.database
      .select()
      .from(userSidsSchema)
      .where(eq(userSidsSchema.sid, sid));

    return rows.map((r) => this.mapRow(r));
  }
}
