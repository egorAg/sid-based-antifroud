import { ApiProperty } from '@nestjs/swagger';
import { UserSidEntryDto } from '../dtos/user-sid-entry.dto';

export class MySidsResponse {
  @ApiProperty({
    example: 7,
  })
  userId: number;

  @ApiProperty({
    example: 3,
  })
  count: number;

  @ApiProperty({
    type: [UserSidEntryDto],
  })
  entries: UserSidEntryDto[];

  @ApiProperty({
    example: ['aaa111', 'bbb222', 'ccc333'],
  })
  sids: string[];
}
