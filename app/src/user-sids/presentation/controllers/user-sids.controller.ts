import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserSidRepository } from '../../infrastructure/repositories/user-sid.repository';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { MySidsResponse } from '../responses/my-sids.response';
import { UserSidEntryDto } from '../dtos/user-sid-entry.dto';
import { SidsBySidResponse } from '../responses/sids-by-sid.response';
import { UserShortEntity } from '../../../user/domain/entities/user-short.entity';

@ApiTags('Debug SIDs')
@ApiBearerAuth()
@Controller('users/sids')
export class UserSidsController {
  constructor(private readonly userSidRepo: UserSidRepository) {}

  @Get('me')
  @ApiOperation({
    summary: 'Получить все SIDs текущего пользователя',
  })
  @ApiOkResponse({
    description: 'Список всех SID, связанных с текущим пользователем',
    type: MySidsResponse,
  })
  async getMySids(
    @CurrentUser() user: UserShortEntity,
  ): Promise<MySidsResponse> {
    const entries = await this.userSidRepo.findByUserId(user.id);

    return {
      userId: user.id,
      count: entries.length,
      entries: entries as unknown as UserSidEntryDto[],
      sids: entries.map((e) => e.sid),
    };
  }

  @Get('by-sid/:sid')
  @ApiOperation({
    summary: 'Получить список пользователей, связанных с указанным SID',
  })
  @ApiParam({
    name: 'sid',
    example: 'abc123qwe987',
    description: 'SID пользователя',
  })
  @ApiOkResponse({
    description: 'Записи user_sids по конкретному SID',
    type: SidsBySidResponse,
  })
  async getBySid(@Param('sid') sid: string): Promise<SidsBySidResponse> {
    const entries = await this.userSidRepo.findBySid(sid);

    return {
      sid,
      count: entries.length,
      entries: entries as unknown as UserSidEntryDto[],
      userIds: [...new Set(entries.map((e) => e.userId))],
    };
  }
}
