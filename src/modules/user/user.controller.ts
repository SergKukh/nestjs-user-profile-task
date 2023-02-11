import {
  Controller,
  UseGuards,
  Request,
  Get,
  Put,
  Body,
  UploadedFile,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ControllerRoutes } from '@constants/routes';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guards';
import { getAuthorizationApiHeader } from '@utils/swagger';
import { RequestBody } from '@modules/auth/types';
import { UserService } from './user.service';
import UserResponseDto from './dto/user-response.dto';
import UpdateUserDto from './dto/update-user.dto';
import SetProfileImageResponseDto from './dto/set-profile-image-response.dto';

@ApiTags(ControllerRoutes.USER)
@Controller(ControllerRoutes.USER)
@UseGuards(JwtAuthGuard)
@ApiHeader(getAuthorizationApiHeader())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'get information about current user' })
  @ApiResponse({ type: UserResponseDto })
  @Get('')
  getUser(@Request() req: RequestBody): UserResponseDto {
    return this.userService.getUser(req.user);
  }

  @ApiOperation({ summary: 'update information about current user' })
  @Put('')
  updateUser(
    @Request() req: RequestBody,
    @Body() dto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUser(req.user, dto);
  }

  @ApiOperation({ summary: 'set profile image' })
  @ApiResponse({ type: SetProfileImageResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('setprofileimage')
  @UseInterceptors(FileInterceptor('image'))
  setProfileImage(
    @Request() req: RequestBody,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<SetProfileImageResponseDto> {
    return this.userService.setProfileImage(req.user, image);
  }
}
