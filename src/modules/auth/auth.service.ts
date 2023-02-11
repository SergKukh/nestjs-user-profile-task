import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@modules/user/user.service';
import CreateUserDto from '@modules/user/dto/create-user.dto';
import AuthResponseDto from './dto/auth-response.dto';
import TokenDto from './dto/token.dto';
import SignInDto from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.findOne({ email: dto.email });
      if (user) {
        throw new BadRequestException('User is already exist');
      }

      await this.userService.create(dto);

      return this.createToken(dto.email);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(dto: SignInDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.findOne({ email: dto.email }, [
        'password',
      ]);

      if (!user) {
        throw new BadRequestException('wrong credentials');
      }

      const isPassEquals = await bcrypt.compare(dto.password, user.password);
      if (!isPassEquals) {
        throw new BadRequestException('wrong credentials');
      }

      return this.createToken(user.email);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async confirmEmail(key: string): Promise<string> {
    try {
      const user = await this.userService.findOne({ emailConfirmKey: key }, [
        'emailConfirmKey',
      ]);

      if (!user) {
        throw new BadRequestException('Wrong link');
      }

      await this.userService.update(user.id, { isEmailConfirmed: true });

      return 'Email confirmed';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private createToken(email: string): AuthResponseDto {
    const payload: TokenDto = { email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
