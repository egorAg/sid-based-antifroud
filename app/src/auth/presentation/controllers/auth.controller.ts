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
import {AuthTokenDto} from "../dto/auth-token.dto";
import {RegisterDto} from "../dto/register.dto";
import {LoginDto} from "../dto/login.dto";
import {MeDto} from "../dto/me.dto";
import {CurrentUser} from "../../infrastructure/decorators/current-user.decorator";
import {UserShortEntity} from "../../../user/domain/user-short.entity";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiCreatedResponse({
        description: 'Пользователь успешно зарегистрирован',
        type: AuthTokenDto,
    })
    @ApiBadRequestResponse({ description: 'Невалидные данные' })
    @ApiConflictResponse({ description: 'Пользователь с таким email уже существует' })
    async register(@Body() dto: RegisterDto): Promise<AuthTokenDto> {
        return this.service.register(dto.email, dto.password);
    }

    @Post('login')
    @ApiOperation({ summary: 'Логин пользователя' })
    @ApiOkResponse({
        description: 'Успешная авторизация',
        type: AuthTokenDto,
    })
    @ApiBadRequestResponse({ description: 'Невалидные данные' })
    @ApiUnauthorizedResponse({ description: 'Неверные логин или пароль' })
    async login(@Body() dto: LoginDto): Promise<AuthTokenDto> {
        return this.service.login(dto.email, dto.password);
    }

    @Get('me')
    @ApiOperation({ summary: 'Текущий пользователь' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Информация о текущем пользователе', type: MeDto })
    @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
    async me(@CurrentUser() user: UserShortEntity): Promise<MeDto> {
        return {
            id: user.id,
            email: user.email,
        };
    }
}
