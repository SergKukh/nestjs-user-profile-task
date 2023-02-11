import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guards';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { User } from '@entities/User.entity';
import UpdateUserDto from '@modules/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const userService = {
    getUser: jest.fn().mockImplementation((user: User) => user),
    updateUser: jest
      .fn()
      .mockImplementation((user: User, dto: UpdateUserDto) => ({})),
  };

  const mockUser = {
    id: 1,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;

          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it('/user (GET) current user infomation', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(HttpStatus.OK)
      .expect(mockUser);
  });

  describe('/user (PUT) update user', () => {
    it('should return status code 200', () => {
      return request(app.getHttpServer())
        .put('/user')
        .send({ firstName: 'John' })
        .expect(HttpStatus.OK);
    });

    it('wrong type: should return status code 400', () => {
      return request(app.getHttpServer())
        .put('/user')
        .send({ firstName: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
