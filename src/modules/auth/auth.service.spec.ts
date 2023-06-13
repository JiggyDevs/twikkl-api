import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Document } from 'mongoose';
import { User, UserDocument } from '../users/schemas/users.schema';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
            isEmailOrUsernameTaken: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return null if user does not exist', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValueOnce(null);

      const result = await service.signIn(username, password);

      expect(usersService.findOneByUsername).toHaveBeenCalledWith(username);
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      const user = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'passwordhash',
        groups: [],
      };

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValueOnce(user as UserDocument);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      const result = await service.signIn(username, password);

      expect(usersService.findOneByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toBeNull();
    });

    it('should return the user and access token if login is successful', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      const user = {
        username: 'testuser',
        password: 'passwordhash',
      };

      const token = 'accesstoken';

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValueOnce(user as UserDocument);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest
        .spyOn(service, 'generateToken')
        .mockReturnValueOnce({ access_token: token });

      const expectedResult = {
        username: 'testuser',
        _id: 'userId',
        access_token: token,
      };

      const result = await service.signIn(username, password);

      expect(usersService.findOneByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(service.generateToken).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signUp', () => {
    it('should throw an error if email or username is taken', async () => {
      const signUpDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword',
      };

      const errorMessage = 'Email or username is already taken';

      jest
        .spyOn(usersService, 'isEmailOrUsernameTaken')
        .mockResolvedValueOnce(errorMessage);

      await expect(service.signUp(signUpDto)).rejects.toThrowError(
        errorMessage,
      );
      expect(usersService.isEmailOrUsernameTaken).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.username,
      );
    });

    it('should create a new user and return the user and access token', async () => {
      const signUpDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword',
      };

      const createdUser = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'passwordhash',
        groups: [],
      };

      const token = 'accesstoken';

      jest
        .spyOn(usersService, 'isEmailOrUsernameTaken')
        .mockResolvedValueOnce('false');
      jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce(createdUser as UserDocument);
      jest
        .spyOn(service, 'generateToken')
        .mockReturnValueOnce({ access_token: token });

      const expectedResult = {
        _id: 'userId',
        email: 'test@example.com',
        username: 'testuser',
        access_token: token,
      };

      const result = await service.signUp(signUpDto);

      expect(usersService.isEmailOrUsernameTaken).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.username,
      );
      expect(usersService.create).toHaveBeenCalledWith(signUpDto);
      expect(service.generateToken).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(expectedResult);
    });
  });
});
