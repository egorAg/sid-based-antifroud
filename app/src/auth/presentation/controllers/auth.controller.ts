import { Body, Controller, Get, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';
import {AuthService} from "../../application/services/auth.service";
import {RegisterDto} from "../dto/register.dto";
import {LoginDto} from "../dto/login.dto";
import {MeResponse} from "../responses/me.response";
import {CurrentUser} from "../../infrastructure/decorators/current-user.decorator";
import {UserShortEntity} from "../../../user/domain/user-short.entity";
import {AuthTokenResponse} from "../responses/auth-token.response";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('register')
    @ApiOperation({
        summary: 'Регистрация нового пользователя'
    })
    @ApiCreatedResponse({
        description: 'Пользователь успешно зарегистрирован',
        type: AuthTokenResponse,
    })
    @ApiBadRequestResponse({
        description: 'Невалидные данные'
    })
    @ApiConflictResponse({
        description: 'Пользователь с таким email уже существует'
    })
    async register(@Body() dto: RegisterDto): Promise<AuthTokenResponse> {
        return this.service.register(dto.email, dto.password);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Логин пользователя'
    })
    @ApiOkResponse({
        description: 'Успешная авторизация',
        type: AuthTokenResponse,
    })
    @ApiBadRequestResponse({
        description: 'Невалидные данные'
    })
    @ApiUnauthorizedResponse({
        description: 'Неверные логин или пароль'
    })
    async login(@Body() dto: LoginDto): Promise<AuthTokenResponse> {
        return this.service.login(dto.email, dto.password);
    }

    @Get('me')
    @ApiOperation({
        summary: 'Текущий пользователь'
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Информация о текущем пользователе', type: MeResponse
    })
    @ApiUnauthorizedResponse({
        description: 'Пользователь не авторизован'
    })
    async me(@CurrentUser() user: UserShortEntity): Promise<MeResponse> {
        return {
            id: user.id,
            email: user.email,
        };
    }
}
