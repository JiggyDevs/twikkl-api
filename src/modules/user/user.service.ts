import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { FollowUserDto } from './dto/follow-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashPassword;
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(
    pagination: PaginationDto
  ): Promise<{ data: UserDocument[]; total: number }> {
    const { page, limit = 1 } = pagination;
    const skip = page ? (page - 1) * limit : 0;
    const total = await this.userModel.countDocuments();
    const users = await this.userModel.find().skip(skip).limit(limit);
    return { data: users, total };
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user.toObject();
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

  async followUser(followUserDto: FollowUserDto): Promise<User> {
    const { userId, userToFollowId } = followUserDto;
    console.log({ userId, userToFollowId });
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { following: userToFollowId } },
        { new: true },
      )
      .exec();
  }

  async unfollowUser(unfollowUserDto: FollowUserDto): Promise<User> {
    const { userId, userToFollowId: userToUnfollowId } = unfollowUserDto;
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { following: userToUnfollowId },
      },
      { new: true },
    );

    if (!user) {
      throw new Error('User not found.');
    }

    // Optional: You can perform additional validation or checks here

    return user;
  }
}
