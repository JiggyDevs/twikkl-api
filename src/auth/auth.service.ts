import { CreateUserDto } from './../users/dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: UserDocument) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log({ user });
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      return null;
    }
    const { password, ...result } = user;

    return {
      ...result,
      access_token: await this.generateToken(user),
    };
  }
  async signUp(signUpDTO: CreateUserDto) {
    // Check if user exists by email and username
    const isTaken = await this.usersService.isEmailOrUsernameTaken(
      signUpDTO.email,
      signUpDTO.username,
    );
    if (isTaken) {
      throw new Error(isTaken);
    }
    const user = await this.usersService.create(signUpDTO);
    const { password: pass, ...result } = user.toObject();

    return { ...result, access_token: await this.generateToken(user) };
  }
}
