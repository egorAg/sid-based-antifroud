import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {REQUEST_USER_SYMBOL} from "../middlewares/jwt.middleware";

export const CurrentUser = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();

        const user =
            req.user ??
            req.raw?.user ??
            req.requestPayloadStream?.user ??
            req[REQUEST_USER_SYMBOL] ??
            null;

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    },
);
