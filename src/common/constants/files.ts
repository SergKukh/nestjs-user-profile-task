import * as path from 'path';

export enum ProfileImageSizes {
  ORIGINAl = 'original',
  MEDIUM = 'medium',
  SMALL = 'small',
}

export const ProfileImageSizeWidth = {
  medium: 350,
  small: 150,
};

export const filePath = path.resolve(__dirname, '..', '..', '..', 'static');

export enum FilePath {
  PROFILE_IMAGE = 'profileimage',
}

export const profileImagePath = path.resolve(filePath, FilePath.PROFILE_IMAGE);
