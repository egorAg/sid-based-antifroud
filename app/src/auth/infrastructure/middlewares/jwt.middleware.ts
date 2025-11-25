import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import {AuthService} from "../../application/services/auth.service";

export const REQUEST_USER_SYMBOL = Symbol.for('request_user');

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly auth: AuthService) {}

    async use(req: FastifyRequest, _: FastifyReply, next: () => void): Promise<void> {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.slice('Bearer '.length);

        try {
            const payload = await this.auth.verifyToken(token);

            const user = {
                id: payload.sub,
                email: payload.email,
            };

            (req as any).user = user;

            if (req.raw) {
                (req.raw as any).user = user;
            }

            if ((req as any).requestPayloadStream) {
                ((req as any).requestPayloadStream as any).user = user;
            }

            (req as any)[REQUEST_USER_SYMBOL] = user;

        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }

        next();
    }
}
