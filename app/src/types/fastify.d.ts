import 'fastify';
import { UserShortEntity } from '../user/domain/entities/user-short.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserShortEntity;
    sid?: string;
    requestId?: string;
  }
}
