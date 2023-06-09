import { CreateUserDto } from './../users/dto/create-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log({ user });
    if (!user) {
      throw new UnauthorizedException();
    }
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user.toObject();

    const payload = { sub: user._id, username: user.username };
    return {
      ...result,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signUp(signUpDTO: CreateUserDto): Promise<any> {
    const user = await this.usersService.create(signUpDTO);
    const { password: pass, ...result } = user.toObject();

    return result;
  }
}
