import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
// import { FollowUserDto } from './dto/follow-user.dto';
import { IDataServices } from 'src/core/abstracts';
import { hash } from 'src/lib/utils'
import { OptionalQuery } from 'src/core/types/database';
import { AlreadyExistsException } from 'src/lib/exceptions';
import { UserFactoryService } from './user-factory.service';
import { IGetAllUsers } from './user.type';

@Injectable()
export class UserService {
  constructor(
    private data: IDataServices,
    private userFactory: UserFactoryService
    ) 
    {}

  cleanUserQuery(data: IGetAllUsers) {
    let key = {}

    if (data._id) key['_id'] = data._id
    if (data.email) key['email'] = data.email
    if (data.following) key['following'] = data.following
    if (data.groups) key['groups'] = data.groups
    if (data.page) key['page'] = data.page
    if (data.perpage) key['perpage'] = data.perpage
    if (data.sort) key['sort'] = data.sort
    if (data.username) key['username'] = data.username

    return key
  }  

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const { email, password, username } = createUserDto

      const user = await this.data.users.findOne({ email })
      if (user) {
        throw new AlreadyExistsException('User with that email already exists!')
      }

      const hashedPassword = await hash(password)
      const userPayload: OptionalQuery<User> = {
        email,
        password: hashedPassword,
        username
      }

      const userFactory = this.userFactory.create(userPayload)
      const data = await this.data.users.create(userFactory)

      return data
    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async findAll(payload: IGetAllUsers) {
    const filterQuery = this.cleanUserQuery(payload)
    const { data, pagination } = await this.data.users.findAllWithPagination(filterQuery)
    return {
      data,
      pagination
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.data.users.findOne({ _id: id })
      if (!user) {
        throw new NotFoundException('User not found!')
      }

      return user
    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    try {
      const user = await this.data.users.findOne({ username })
      if (!user) {
        throw new NotFoundException('User not found!')
      }

      return user
    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.data.users.findOne({ email })
      if (!user) {
        throw new NotFoundException('User not found!')
      }
      return user
    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  // async isEmailOrUsernameTaken(
  //   email: string,
  //   username: string,
  // ): Promise<string | null> {

  //   const existingUser = await this.userModel.findOne(
  //     {
  //       $or: [{ email }, { username }],
  //     },
  //     { _id: 0, email: 1, username: 1 },
  //   );
  //   console.log({ existingUser });
  //   if (existingUser) {
  //     if (existingUser.email === email) {
  //       return 'Email already exists';
  //     }
  //     if (existingUser.username === username) {
  //       return 'Username is already taken';
  //     }
  //   }

  //   return null;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  // async followUser(followUserDto: FollowUserDto): Promise<User> {
  //   const { userId, userToFollowId } = followUserDto;
  //   console.log({ userId, userToFollowId });
  //   return this.userModel
  //     .findByIdAndUpdate(
  //       userId,
  //       { $addToSet: { following: userToFollowId } },
  //       { new: true },
  //     )
  //     .exec();
  // }

  // async unfollowUser(unfollowUserDto: FollowUserDto): Promise<User> {
  //   const { userId, userToFollowId: userToUnfollowId } = unfollowUserDto;
  //   const user = await this.userModel.findByIdAndUpdate(
  //     userId,
  //     {
  //       $pull: { following: userToUnfollowId },
  //     },
  //     { new: true },
  //   );

  //   if (!user) {
  //     throw new Error('User not found.');
  //   }

  //   // Optional: You can perform additional validation or checks here

  //   return user;
  // }
}
