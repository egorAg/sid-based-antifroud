import { FastifyReply, FastifyRequest } from 'fastify';
import { SidBinderService } from '../../application/services/sid-binder.service';

export function createSidBindHook(binder: SidBinderService) {
  return async function sidBindHook(req: FastifyRequest, reply: FastifyReply) {
    const { user, sid, requestId } = req;

    if (!user || !sid) {
      return Promise.resolve();
    }

    binder.bindSid(user.id, sid, requestId).catch((err: any) => {
      if (err instanceof Error) {
        reply.request.log.error(
          `[${requestId}] Failed to bind SID=${sid} for user=${user.id}: ${err.message}`,
        );
      } else {
        reply.request.log.error(
          `[${requestId}] Failed to bind SID=${sid} for user=${user.id}: Unknown error`,
        );
      }
    });
  };
}
