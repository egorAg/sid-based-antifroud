import { ApiProperty } from '@nestjs/swagger';

export class UserSidEntryDto {
  @ApiProperty({
    example: 12,
  })
  id: number;

  @ApiProperty({
    example: 7,
  })
  userId: number;

  @ApiProperty({
    example: 'qWErty123abcXYZ987',
  })
  sid: string;

  @ApiProperty({
    example: '2025-11-26T10:23:45.123Z',
  })
  createdAt: string;
}
