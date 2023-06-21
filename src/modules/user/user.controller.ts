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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }
  @Get('profile')
  @UseGuards(AuthGuard)
  async findUserProfile(@Request() req) {
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
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
      }
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
