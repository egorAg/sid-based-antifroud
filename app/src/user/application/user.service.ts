import { Injectable, ConflictException } from '@nestjs/common';
import {UserRepository} from "../infrastructure/repositories/user.repository";

@Injectable()
export class UserService {
    constructor(private readonly repo: UserRepository) {}

    async createUser(email: string, passwordHash: string) {
        const existing = await this.repo.findByEmail(email);
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        return this.repo.create(email, passwordHash);
    }

    async findByEmail(email: string) {
        return this.repo.findByEmail(email);
    }
}
