import { ApiProperty } from '@nestjs/swagger';
import { mockToken } from '@mocks/auth';

export default class AuthResponseDto {
  @ApiProperty({
    example: mockToken,
  })
  access_token: string;
}
