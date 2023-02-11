import {
  filePath,
  FilePath,
  profileImagePath,
  ProfileImageSizes,
  ProfileImageSizeWidth,
} from '@constants/files';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { outputFile, remove } from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import SetProfileImageResponseDto from '@modules/user/dto/set-profile-image-response.dto';

@Injectable()
export class FileService {
  async createProfileImage(
    file: Express.Multer.File,
  ): Promise<SetProfileImageResponseDto> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileNameKey = uuid.v4();
      const fileName = `${fileNameKey}_${ProfileImageSizes.ORIGINAl}.${fileExtension}`;
      const originalFilePath = path.resolve(profileImagePath, fileName);

      await outputFile(originalFilePath, file.buffer);

      const metadata = await sharp(originalFilePath).metadata();

      const mediumFile = await this.resizeProfileImage(
        originalFilePath,
        fileName,
        metadata.width,
        metadata.height,
        ProfileImageSizeWidth.medium,
        fileNameKey,
        fileExtension,
        ProfileImageSizes.MEDIUM,
      );

      const smallFile = await this.resizeProfileImage(
        originalFilePath,
        fileName,
        metadata.width,
        metadata.height,
        ProfileImageSizeWidth.small,
        fileNameKey,
        fileExtension,
        ProfileImageSizes.SMALL,
      );

      return {
        original: `${FilePath.PROFILE_IMAGE}/${fileName}`,
        medium: `${FilePath.PROFILE_IMAGE}/${mediumFile}`,
        small: `${FilePath.PROFILE_IMAGE}/${smallFile}`,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async resizeProfileImage(
    originalFilePath: string,
    originalFileName: string,
    width: number,
    height: number,
    toWidth: number,
    fileKey: string,
    fileExtension: string,
    sizeName: string,
  ): Promise<string> {
    if (width > toWidth) {
      const fileName = `${fileKey}_${sizeName}.${fileExtension}`;
      const currentFilePath = path.resolve(profileImagePath, fileName);

      await sharp(originalFilePath)
        .resize({
          width: toWidth,
          height: Math.round((height / width) * toWidth),
        })
        .toFile(currentFilePath);

      return fileName;
    }

    return originalFileName;
  }

  async removeFiles(fileNames: string[]): Promise<void> {
    try {
      fileNames.forEach(async (fileName) => {
        if (!fileName) {
          return;
        }
        const currentFilePath = path.resolve(filePath, fileName);
        await remove(currentFilePath);
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
