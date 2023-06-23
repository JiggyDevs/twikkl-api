import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUserDto } from './dto/get-user.dto';
import { UserInterceptor } from './interceptor/user.interceptor';

// @UseInterceptors(UserInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async findUserProfile(@Request() req): Promise<GetUserDto> {
    try {
      const user = await this.userService.findOne(req.user.sub);
      if (!user) {
        throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
  }

  @Post('/follow/:userToFollowId')
  @UseGuards(AuthGuard)
  async followUser(
    @Request() req,
    @Param('userToFollowId') userToFollowId: string,
  ): Promise<any> {
    console.log('userToFollowId', userToFollowId);
    const user = await this.userService.followUser({
      userId: req.user.sub,
      userToFollowId,
    });
    return { message: 'User followed successfully', user };
  }

  @Post('/unfollow/:userToUnfollowId')
  @UseGuards(AuthGuard)
  async unfollowUser(
    @Request() req,
    @Param('userToUnfollowId') userToUnfollowId: string,
  ): Promise<any> {
    console.log('userToUnfollowId', userToUnfollowId);
    const user = await this.userService.unfollowUser({
      userId: req.user.sub,
      userToFollowId: userToUnfollowId,
    });
    return { message: 'User unfollowed successfully', user };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
