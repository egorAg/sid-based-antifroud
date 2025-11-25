import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import {UserService} from "../../../user/application/user.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UserService,
        private readonly jwt: JwtService,
    ) {}

    async register(email: string, password: string) {
        const existing = await this.users.findByEmail(email);
        if (existing) throw new UnauthorizedException('User already exists');

        const passwordHash = await hash(password, 10);
        const user = await this.users.createUser(email, passwordHash);

        return this.generateToken(user.id, user.email);
    }

    async login(email: string, password: string) {
        const user = await this.users.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        return this.generateToken(user.id, user.email);
    }

    private generateToken(userId: number, email: string) {
        const payload = { sub: userId, email };
        const accessToken = this.jwt.sign(payload);

        return { accessToken };
    }

    verifyToken(token: string) {
        try {
            return this.jwt.verify(token);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
