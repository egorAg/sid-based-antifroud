import { ApiProperty } from '@nestjs/swagger';
import { UserSidEntryDto } from '../dtos/user-sid-entry.dto';

export class SidsBySidResponse {
  @ApiProperty({ example: 'aaa111bbb222ccc333' })
  sid: string;

  @ApiProperty({ example: 5 })
  count: number;

  @ApiProperty({ type: [UserSidEntryDto] })
  entries: UserSidEntryDto[];

  @ApiProperty({
    example: [7, 12, 55],
    description: 'ID пользователей, у которых встречается этот SID',
  })
  userIds: number[];
}
