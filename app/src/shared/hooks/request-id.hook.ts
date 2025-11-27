import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

export async function requestIdHook(req: FastifyRequest, reply: FastifyReply) {
    const id = randomUUID();
    req.requestId = id;
    reply.header('x-request-id', id);
    return Promise.resolve();
}
