import { IsEmail } from 'class-validator';

export default class TokenDto {
  @IsEmail()
  readonly email: string;
}
