import { ApiProperty } from '@nestjs/swagger';

export default class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: true })
  isEmailConfirmed: boolean;

  @ApiProperty({
    example: {
      original:
        'profileimage/a4723670-512c-4268-8a27-a9b5fbe8eb02_original.jpg',
      medium: 'profileimage/a4723670-512c-4268-8a27-a9b5fbe8eb02_medium.jpg',
      small: 'profileimage/a4723670-512c-4268-8a27-a9b5fbe8eb02_small.jpg',
    },
  })
  profileImage: {
    original: string;
    medium: string;
    small: string;
  };
}
