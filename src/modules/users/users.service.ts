import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashPassword;
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw new Error('User not found');
    }
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async isEmailOrUsernameTaken(
    email: string,
    username: string,
  ): Promise<string | null> {
    // const userExists = await this.userModel.exists({
    //   $or: [{ email }, { username }],
    // });

    const existingUser = await this.userModel.findOne(
      {
        $or: [{ email }, { username }],
      },
      { _id: 0, email: 1, username: 1 },
    );
    console.log({ existingUser });
    if (existingUser) {
      if (existingUser.email === email) {
        return 'Email already exists';
      }
      if (existingUser.username === username) {
        return 'Username is already taken';
      }
    }

    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
