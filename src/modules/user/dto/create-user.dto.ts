import {
  passwordMinLength,
  passwordValidationMessage,
  passwordValidationRexExp,
} from '@constants/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export default class CreateUserDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Qwerty123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(passwordMinLength)
  @Matches(passwordValidationRexExp, {
    message: passwordValidationMessage,
  })
  readonly password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
}
