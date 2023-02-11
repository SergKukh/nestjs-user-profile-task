import { ApiProperty } from '@nestjs/swagger';

export default class SetProfileImageResponseDto {
  @ApiProperty({
    example: 'profileimage/a4723670-512c-4268-8a27-a9b5fbe8eb02_original.jpg',
  })
  original: string;

  @ApiProperty({
    example: 'profileimage/a4723670-512c-4268-8a27-a9b5fbe8eb02_medium.jpg',
  })
  medium: string;

  @ApiProperty({
    example: 'profileimage/a4723670-512c-4268-8a27-a9b5fbe8eb02_small.jpg',
  })
  small: string;
}
