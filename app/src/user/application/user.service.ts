import { Injectable, ConflictException } from '@nestjs/common';
import {UserRepository} from "../infrastructure/repositories/user.repository";
import {UserEntity} from "../domain/user.entity";

@Injectable()
export class UserService {
    constructor(private readonly repo: UserRepository) {}

    async createUser(email: string, passwordHash: string): Promise<UserEntity> {
        const existing = await this.repo.findByEmail(email);

        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        return this.repo.create(email, passwordHash);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const userEntity = await this.repo.findByEmail(email);

        if (!userEntity) {
            throw new Error(`Can't find user with this email address: ${email}`);
        }

        return userEntity;
    }
}
