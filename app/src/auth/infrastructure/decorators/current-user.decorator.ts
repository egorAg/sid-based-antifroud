import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {REQUEST_USER_SYMBOL} from "../middlewares/jwt.middleware";
import {UserShortEntity} from "../../../user/domain/user-short.entity";

export const CurrentUser = createParamDecorator(
    (_, ctx: ExecutionContext): UserShortEntity => {
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
