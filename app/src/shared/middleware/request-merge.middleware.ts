import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class RequestMergeMiddleware implements NestMiddleware {
    use(req: FastifyRequest, _: FastifyReply, next: () => void) {
        if (req.raw && typeof req.raw === 'object') {
            for (const key of Object.keys(req.raw)) {
                if (!(key in req)) {
                    (req as any)[key] = (req.raw as any)[key];
                }
            }
        }

        next();
    }
}
