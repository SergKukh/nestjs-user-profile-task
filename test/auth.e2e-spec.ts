import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import SignInDto from '@modules/auth/dto/sign-in.dto';
import CreateUserDto from '@modules/user/dto/create-user.dto';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { createUserDto, signInDto } from '@mocks/auth';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const authService = {
    signUp: (dto: CreateUserDto) => ({ access_token: dto.email }),
    signIn: (dto: SignInDto) => ({ access_token: dto.email }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('/signup (POST) create new user', () => {
    it('should create new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .expect({
          access_token: createUserDto.email,
        });
    });

    it('wrong email type: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...createUserDto, email: 'test@test' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('wrong password type: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...createUserDto, password: 'qwerty123' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('empty firstName: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...createUserDto, firstName: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('empty lastName: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...createUserDto, lastName: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/signin (POST) login', () => {
    it('should create new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(HttpStatus.CREATED)
        .expect({
          access_token: signInDto.email,
        });
    });

    it('wrong email type: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ ...signInDto, email: 'test@test' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
