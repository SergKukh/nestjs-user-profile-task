import SignInDto from '@modules/auth/dto/sign-in.dto';
import CreateUserDto from '@modules/user/dto/create-user.dto';

export const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFp4NDl9.nw3Ksx0HViWeVaXigLeGpcexMjgOnpVy10aTh0KY-l8';

export const createUserDto: CreateUserDto = {
  email: 'test@test.com',
  password: 'Qwerty123',
  firstName: 'John',
  lastName: 'Doe',
};

export const signInDto: SignInDto = {
  email: 'test@test.com',
  password: 'Qwerty123',
};
