import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export default class SignInDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Qwerty123' })
  @IsString()
  readonly password: string;
}
