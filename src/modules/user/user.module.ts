import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/User.entity';
import { ProfileImage } from '@entities/ProfileImage.entity';
import { MailModule } from '@modules/mail/mail.module';
import { FileModule } from '@modules/file/file.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProfileImage]),
    MailModule,
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
