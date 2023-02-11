import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerRoutes } from '@constants/routes';
import CreateUserDto from '@modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import AuthResponseDto from './dto/auth-response.dto';
import SignInDto from './dto/sign-in.dto';

@ApiTags(ControllerRoutes.AUTH)
@Controller(ControllerRoutes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Creating new user' })
  @ApiResponse({ type: AuthResponseDto })
  @Post('/signup')
  signUp(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ type: AuthResponseDto })
  @Post('/signin')
  signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(dto);
  }

  @ApiOperation({ summary: 'Confirm email' })
  @ApiParam({ name: 'key', description: 'secret key' })
  @Get('/confirm/:key')
  @HttpCode(HttpStatus.OK)
  confirmEmail(@Param('key') key: string): Promise<string> {
    return this.authService.confirmEmail(key);
  }
}
