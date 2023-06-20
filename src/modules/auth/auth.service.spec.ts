import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Document } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
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
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return null if user does not exist', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(null);

      const result = await service.signIn(username, password);

      expect(userService.findOneByUsername).toHaveBeenCalledWith(username);
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
        .spyOn(userService, 'findOneByUsername')
        .mockResolvedValueOnce(user as UserDocument);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      const result = await service.signIn(username, password);

      expect(userService.findOneByUsername).toHaveBeenCalledWith(username);
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
        .spyOn(userService, 'findOneByUsername')
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

      expect(userService.findOneByUsername).toHaveBeenCalledWith(username);
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
        .spyOn(userService, 'isEmailOrUsernameTaken')
        .mockResolvedValueOnce(errorMessage);

      await expect(service.signUp(signUpDto)).rejects.toThrowError(
        errorMessage,
      );
      expect(userService.isEmailOrUsernameTaken).toHaveBeenCalledWith(
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
        .spyOn(userService, 'isEmailOrUsernameTaken')
        .mockResolvedValueOnce('false');
      jest
        .spyOn(userService, 'create')
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

      expect(userService.isEmailOrUsernameTaken).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.username,
      );
      expect(userService.create).toHaveBeenCalledWith(signUpDto);
      expect(service.generateToken).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(expectedResult);
    });
  });
});
