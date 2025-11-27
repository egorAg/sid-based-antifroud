import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserShortEntity } from '../../../user/domain/entities/user-short.entity';
import { FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserShortEntity => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    const user = req.user ?? null;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);
