import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import CreateUserDto from '@modules/user/dto/create-user.dto';
import { UserService } from '@modules/user/user.service';
import { createUserDto, signInDto } from '@mocks/auth';
import { AuthService } from './auth.service';
import TokenDto from './dto/token.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserService = {
    create: (dto: CreateUserDto) => dto,
    findOne: (payload: object) => payload,
    update: (id: number, payload: object) => ({}),
  };

  const mockJwtService = {
    sign: (payload: TokenDto) => payload.email,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('Sign up', () => {
    it('should return access token', async () => {
      jest.spyOn(mockUserService, 'findOne').mockReturnValue(null);

      expect(await authService.signUp(createUserDto)).toStrictEqual({
        access_token: createUserDto.email,
      });
    });

    it('if user exist should throw bad request exception', async () => {
      jest.spyOn(mockUserService, 'findOne').mockReturnValue(createUserDto);

      await expect(authService.signUp(createUserDto)).rejects.toEqual(
        new BadRequestException('User is already exist'),
      );
    });
  });

  describe('Sign in', () => {
    it('should return access token', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      expect(await authService.signIn(signInDto)).toStrictEqual({
        access_token: createUserDto.email,
      });
    });

    it('if email wrong should throw bad request exception', async () => {
      jest.spyOn(mockUserService, 'findOne').mockReturnValue(null);

      await expect(authService.signIn(signInDto)).rejects.toEqual(
        new BadRequestException('wrong credentials'),
      );
    });

    it('if password wrong should throw bad request exception', async () => {
      jest.spyOn(mockUserService, 'findOne').mockReturnValue(signInDto);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.signIn(signInDto)).rejects.toEqual(
        new BadRequestException('wrong credentials'),
      );
    });
  });

  describe('Confirm email', () => {
    it('should return Email confirm string', async () => {
      jest.spyOn(mockUserService, 'findOne').mockReturnValue({ id: 1 });

      expect(await authService.confirmEmail('test')).toStrictEqual(
        'Email confirmed',
      );
    });

    it('user not found: should throw bad request exception', async () => {
      jest.spyOn(mockUserService, 'findOne').mockReturnValue(null);

      await expect(authService.confirmEmail('test')).rejects.toEqual(
        new BadRequestException('Wrong link'),
      );
    });
  });
});
