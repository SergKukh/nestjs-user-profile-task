import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@entities/User.entity';
import { ProfileImage } from '@entities/ProfileImage.entity';
import { mockRepository } from '@mocks/entities';
import { MailService } from '@modules/mail/mail.service';
import { FileService } from '@modules/file/file.service';
import { UserService } from './user.service';
import { ProfileImageSizes } from '@constants/files';

describe('UserService', () => {
  let userService: UserService;

  const mockConfigService = {
    get: () => '',
  };

  const mockMailService = {};
  const mockFileService = {
    createProfileImage: jest
      .fn()
      .mockImplementation((file: Express.Multer.File) => {
        return {
          original: 'test',
          medium: 'test',
          small: 'test',
        };
      }),
    removeFiles: jest.fn().mockImplementation((fileNames: string[]) => ({})),
  };

  const user = {
    id: 1,
    profileImage: [
      { size: ProfileImageSizes.ORIGINAl, link: 'test' },
      { size: ProfileImageSizes.MEDIUM, link: 'test' },
      { size: ProfileImageSizes.SMALL, link: 'test' },
    ],
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ProfileImage),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('Get user', () => {
    it('should return user with object of profile images', () => {
      expect(userService.getUser(user)).toEqual({
        ...user,
        profileImage: {
          original: expect.any(String),
          medium: expect.any(String),
          small: expect.any(String),
        },
      });
    });
  });

  describe('Update user', () => {
    it('should update user', async (): Promise<void> => {
      const user = { id: 1 } as User;
      const payload = { firstName: 'John' };
      jest.spyOn(mockRepository, 'createQueryBuilder');

      await userService.updateUser(user, payload);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });
  });

  describe('Set profile image', () => {
    it('should create images and return it', async () => {
      const image = {} as Express.Multer.File;
      jest.spyOn(mockFileService, 'createProfileImage');
      jest.spyOn(mockFileService, 'removeFiles');
      jest.spyOn(mockRepository, 'createQueryBuilder');

      await userService.setProfileImage(user, image);

      expect(mockFileService.createProfileImage).toBeCalledWith(image);
      expect(mockFileService.removeFiles).toBeCalledWith(
        user.profileImage.map((file) => file.link),
      );

      expect(mockRepository.createQueryBuilder).toBeCalledTimes(2);
    });
  });
});
