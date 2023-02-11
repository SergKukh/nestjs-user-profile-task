import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { User } from '@entities/User.entity';
import { ProfileImage } from '@entities/ProfileImage.entity';
import { ProfileImageSizes } from '@constants/files';
import { MailService } from '@modules/mail/mail.service';
import { FileService } from '@modules/file/file.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import SetProfileImageResponseDto from './dto/set-profile-image-response.dto';
import UserResponseDto from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProfileImage)
    private profileImageRepository: Repository<ProfileImage>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
  ) {}

  async create(dto: CreateUserDto): Promise<InsertResult> {
    try {
      const user = { ...dto };
      user.password = await bcrypt.hash(
        user.password,
        +this.configService.get('BCRYPT_SALT_ROUNDS'),
      );
      const emailConfirmKey = uuidv4();

      const result = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([{ ...user, emailConfirmKey }])
        .execute();

      this.mailService.sendConfirmEmail(user.email, emailConfirmKey);

      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(
    payload: object,
    hiddenColumns?: string[],
    leftJoins?: string[],
  ): Promise<User> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .where(payload);

      if (hiddenColumns) {
        hiddenColumns.forEach((column) => {
          query.addSelect(`user.${column}`);
        });
      }

      if (leftJoins) {
        leftJoins.forEach((join) => {
          query.leftJoinAndSelect(`user.${join}`, join);
        });
      }

      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, payload: object) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(payload)
        .where({ id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  getUser(user: User): UserResponseDto {
    try {
      return {
        ...user,
        profileImage: {
          original: user.profileImage.find(
            (file) => file.size === ProfileImageSizes.ORIGINAl,
          )?.link,
          medium: user.profileImage.find(
            (file) => file.size === ProfileImageSizes.MEDIUM,
          )?.link,
          small: user.profileImage.find(
            (file) => file.size === ProfileImageSizes.SMALL,
          )?.link,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(user: User, dto: UpdateUserDto): Promise<void> {
    try {
      await this.update(user.id, dto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async setProfileImage(
    user: User,
    image: Express.Multer.File,
  ): Promise<SetProfileImageResponseDto> {
    try {
      const images = await this.fileService.createProfileImage(image);
      await this.fileService.removeFiles(
        user.profileImage.map((file) => file.link),
      );

      await this.profileImageRepository
        .createQueryBuilder()
        .delete()
        .from(ProfileImage)
        .where({ user })
        .execute();

      await this.profileImageRepository
        .createQueryBuilder()
        .insert()
        .into(ProfileImage)
        .values(
          Object.keys(images).map((key) => ({
            size: key as ProfileImageSizes,
            link: images[key],
            user,
          })),
        )
        .execute();

      return images;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
