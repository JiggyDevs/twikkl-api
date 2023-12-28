import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Request, Response } from 'express';
import { CreatePostDto, EditPostDto } from './dto/create-post.dto';
import {
  FindPostById,
  ICreatePost,
  IDeletePost,
  IEditPost,
  IGetLikes,
  IGetPost,
  IGetUserPosts,
  ILikePost,
} from './post.type';
import { FindByUserId } from '../user/user.type';
// import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('/')
  @UseGuards(StrictAuthGuard)
  // @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePostDto,
  ) {
    const userId = req.user._id;
    const payload: ICreatePost = { ...body, userId };

    const response = await this.service.create(payload);
    return res.status(response.status).json(response);
  }

  @Get('/')
  @UseGuards(StrictAuthGuard)
  async getPosts(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { isDeleted: false };
    const payload: IGetUserPosts = { ...query };

    const response = await this.service.getUserPosts(payload);
    return res.status(response.status).json(response);
  }

  @Get('/feed')
  @UseGuards(StrictAuthGuard)
  async getUserFeed(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { isDeleted: false };
    const payload: IGetUserPosts = { ...query };
    const response = await this.service.getUserFeed(payload);

    return res.status(response.status).json(response);
  }

  @Get('user/:userId')
  @UseGuards(StrictAuthGuard)
  async getUserPosts(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
    @Param('userId') userId: string,
  ) {
    // const userId = req.user._id;
    query = {
      ...query,
      creator: userId,
      isDeleted: false,
      isAdminDeleted: false,
    };
    const payload: IGetUserPosts = { ...query };

    const response = await this.service.getUserPosts(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/:postId')
  @UseGuards(StrictAuthGuard)
  async deletePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: FindPostById,
  ) {
    const userId = req.user._id;
    const { postId } = param;
    const payload: IDeletePost = { userId, postId };

    const response = await this.service.deletePost(payload);
    return res.status(response.status).json(response);
  }

  @Get('/post/:postId')
  @UseGuards(StrictAuthGuard)
  async getPost(@Res() res: Response, @Param() param: FindPostById) {
    const { postId } = param;
    const payload: IGetPost = { postId };

    const response = await this.service.getPost(payload);
    return res.status(response.status).json(response);
  }

  @Post('/post/like/:postId')
  @UseGuards(StrictAuthGuard)
  async likePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: FindPostById,
  ) {
    const userId = req.user._id;
    const { postId } = param;
    const payload: ILikePost = { userId, postId };

    const response = await this.service.likePost(payload);
    return res.status(response.status).json(response);
  }

  @Post('/post/unlike/:postId')
  @UseGuards(StrictAuthGuard)
  async unlikePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: FindPostById,
  ) {
    const userId = req.user._id;
    const { postId } = param;
    const payload: ILikePost = { userId, postId };

    const response = await this.service.unlikePost(payload);
    return res.status(response.status).json(response);
  }

  @Get('post/likes/:postId')
  @UseGuards(StrictAuthGuard)
  async getPostLikes(@Res() res: Response, @Param() param: FindPostById) {
    const { postId } = param;
    const payload: IGetLikes = { postId };

    const response = await this.service.getLikes(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/edit-post/:postId')
  @UseGuards(StrictAuthGuard)
  async editPost(
    @Res() res: Response,
    @Body() body: EditPostDto,
    @Param() params: FindPostById,
  ) {
    const { postId } = params;
    const payload: IEditPost = { ...body, postId };

    const response = await this.service.editPost(payload);
    return res.status(response.status).json(response);
  }
}
