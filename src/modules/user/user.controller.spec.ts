import { Test, TestingModule } from '@nestjs/testing';
import { RequestBody } from '@modules/auth/types';
import { User } from '@entities/User.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import UpdateUserDto from './dto/update-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let req: RequestBody;

  const mockUserService = {
    getUser: jest.fn().mockImplementation((user: User) => user),
    updateUser: jest
      .fn()
      .mockImplementation((user: User, dto: UpdateUserDto) => ({})),
    setProfileImage: jest
      .fn()
      .mockImplementation((user: User, image: Express.Multer.File) => ({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = module.get<UserController>(UserController);

    req = {
      user: {
        id: 1,
      } as User,
    };
  });

  describe('Get user information', () => {
    it('should return information about current user', async () => {
      expect(await userController.getUser(req)).toBe(req.user);
    });
  });

  describe('Update user', () => {
    it('should call updateUser method in userService', async () => {
      const dto: UpdateUserDto = { firstName: 'John' };
      await userController.updateUser(req, dto);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(req.user, dto);
    });
  });

  describe('Set profile image', () => {
    it('should call setProfileImage method in userService', async () => {
      const image = {} as Express.Multer.File;
      await userController.setProfileImage(req, image);

      expect(mockUserService.setProfileImage).toHaveBeenCalledWith(
        req.user,
        image,
      );
    });
  });
});
