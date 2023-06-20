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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUserDto } from './dto/get-user.dto';
import { UserInterceptor } from './interceptor/user.interceptor';

@UseInterceptors(UserInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<GetUserDto[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async findUserProfile(@Request() req): Promise<GetUserDto> {
    try {
      const user = await this.usersService.findOne(req.user.sub);
      if (!user) {
        throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(+id);
  }
}
