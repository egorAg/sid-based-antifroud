import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { UserService } from '../../../user/application/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenResponse } from '../../presentation/responses/auth-token.response';
import { JwtTokenPayload } from '../types/jwt-token-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string): Promise<AuthTokenResponse> {
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await hash(password, 10);

    const user = await this.users.createUser(email, passwordHash);

    return {
      accessToken: await this.generateToken(user.id, user.email),
    };
  }

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await compare(password, user.passwordHash);

    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.generateToken(user.id, user.email),
    };
  }

  private async generateToken(userId: number, email: string): Promise<string> {
    const payload: JwtTokenPayload = { sub: userId, email };
    return this.jwt.signAsync(payload);
  }

  public async verifyToken(token: string): Promise<JwtTokenPayload> {
    try {
      return this.jwt.verifyAsync<JwtTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
