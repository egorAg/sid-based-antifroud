import { FastifyRequest, FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';
import { Logger } from '@nestjs/common';
import { SID_COOKIE_NAME } from '../constants/sid-cookie-name.constant';

const logger = new Logger('SidHook');

export async function sidHook(req: FastifyRequest, reply: FastifyReply) {
  const requestId = req.requestId;

  try {
    let sid = req.cookies?.[SID_COOKIE_NAME];

    if (!sid) {
      sid = nanoid(21);

      reply.setCookie(SID_COOKIE_NAME, sid, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });

      logger.debug(`[RequestId: ${requestId}] Generated new SID: ${sid}`);
    } else {
      logger.debug(`[RequestId: ${requestId}] Existing SID: ${sid}`);
    }

    req.sid = sid;
    return Promise.resolve();
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(
        `[RequestId: ${requestId}] Error in sidHook: ${err.message}`,
        err.stack,
      );
    } else {
      logger.error(`[RequestId: ${requestId}] Unknown error in sidHook`, err);
    }
  }
}
