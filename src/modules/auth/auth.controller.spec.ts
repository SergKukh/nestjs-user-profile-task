import { Test, TestingModule } from '@nestjs/testing';
import { createUserDto, mockToken, signInDto } from '@mocks/auth';
import CreateUserDto from '@modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import SignInDto from './dto/sign-in.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signUp: jest.fn().mockImplementation((dto: CreateUserDto) => ({
      access_token: mockToken,
    })),
    signIn: jest.fn().mockImplementation((dto: SignInDto) => ({
      access_token: mockToken,
    })),
    confirmEmail: jest
      .fn()
      .mockImplementation((key: string) => 'Email confirmed'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('Sign up', () => {
    it('should call signUp method in authService with create user dto', async () => {
      await authController.signUp(createUserDto);

      expect(mockAuthService.signUp).toBeCalledWith(createUserDto);
    });

    it('should return token dto', async () => {
      const token = await authController.signUp(createUserDto);

      expect(token).not.toEqual({});
      expect(token).toHaveProperty('access_token');
    });

    it('access token should have correct type', async () => {
      expect(await authController.signUp(createUserDto)).not.toEqual({
        access_token: expect.any(Number),
      });
    });
  });

  describe('Sign in', () => {
    it('should call signIn method in authService with sign in dto', async () => {
      await authController.signIn(signInDto);

      expect(mockAuthService.signIn).toBeCalledWith(signInDto);
    });

    it('should return token dto', async () => {
      const token = await authController.signIn(signInDto);

      expect(token).not.toEqual({});
      expect(token).toHaveProperty('access_token');
    });

    it('access token should have correct type', async () => {
      expect(await authController.signIn(signInDto)).not.toEqual({
        access_token: expect.any(Number),
      });
    });
  });

  describe('Confirm email', () => {
    it('should call confirmEmail method in authService with key', async () => {
      const key = 'test';
      await authController.confirmEmail(key);

      expect(mockAuthService.confirmEmail).toBeCalledWith(key);
    });
  });
});
