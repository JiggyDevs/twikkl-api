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
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationCursorDto } from './dto/pagination.dto';
import { GetPostDto } from './dto/get-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ObjectIdValidationPipe } from './object-id-validation.pipe';
import { Post as PostModel } from './schemas/post.schema';


@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createPostDto: Omit<CreatePostDto, 'author'>) {
    //TODO: Add check for wrong Data
    return this.postsService.create({ ...createPostDto, author: req.user.sub });
  }

  @Get()
  // @UseGuards(AuthGuard)
  findAll(@Query() pagination: PaginationCursorDto) {
    return this.postsService.findAll(pagination);
  }

  @Post('/like/:id')
  @UseGuards(AuthGuard)
  likePost(@Param('id', ObjectIdValidationPipe) id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.sub);
  }

  @Post('/repost/:id')
  @UseGuards(AuthGuard)
  repostPost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() reply: CreatePostDto,
    @Request() req,
  ) {
    return this.postsService.replyPost(id, { ...reply, author: req.user.sub });
  }

  @Post('/delete/:id')
  @UseGuards(AuthGuard)
  delete(@Param('id', ObjectIdValidationPipe) id: string, @Request() req) {
    return this.postsService.deletePost(id, req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsService.remove(+id);
  }
}
