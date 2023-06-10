import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create({ ...createPostDto, author: req.user.sub });
  }

  @Get()
  // @UseGuards(AuthGuard)
  findAll() {
    return this.postsService.findAll();
  }

  @Post('/like/:id')
  @UseGuards(AuthGuard)
  likePost(@Param('id') id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.sub);
  }

  @Post('/reply/:id')
  @UseGuards(AuthGuard)
  replyPost(
    @Param('id') id: string,
    @Body() reply: CreatePostDto,
    @Request() req,
  ) {
    return this.postsService.replyPost(id, { ...reply, author: req.user.sub });
  }

  @Post('/delete/:id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string, @Request() req) {
    return this.postsService.deletePost(id, req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
