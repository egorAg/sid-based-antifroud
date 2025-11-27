import { FastifyRequest } from 'fastify';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

export function createJwtHook(auth: AuthService) {
  return async function jwtHook(req: FastifyRequest) {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/docs',
      '/docs/',
      '/fastify-docs',
      '/fastify-docs/',
    ];

    if (publicRoutes.some(path => req.url.startsWith(path))) {
      return;
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token or token not provided');
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      const payload = await auth.verifyToken(token);

      req.user = {
        id: payload.sub,
        email: payload.email,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  };
}
