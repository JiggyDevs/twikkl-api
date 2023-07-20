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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Request, Response } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import {
  FindPostById,
  IBookmarkPost,
  ICreatePost,
  IDeletePost,
  IGetBookmarks,
  IGetLikes,
  IGetPost,
  IGetUserPosts,
  ILikePost,
} from './post.type';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('/')
  // @UseGuards(StrictAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = 'req.user._id';
    const payload: ICreatePost = { ...body, userId, file };

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
  async getUserFeed(@Res() res: Response, @Query() query: any) {
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
    query = { creator: userId, isDeleted: false };
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

  @Get('/post/bookmarks')
  @UseGuards(StrictAuthGuard)
  async getBookmarks(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: FindPostById,
  ) {
    const userId = req.user._id;
    const payload: IGetBookmarks = { userId };

    const response = await this.service.getBookmarkedPosts(payload);
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

  @Post('/post/bookmarks/:postId')
  @UseGuards(StrictAuthGuard)
  async bookmarkPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: FindPostById,
  ) {
    const userId = req.user._id;
    const { postId } = param;
    const payload: IBookmarkPost = { userId, postId };

    const response = await this.service.bookmarkPost(payload);
    return res.status(response.status).json(response);
  }

  @Post('/post/bookmarks/:postId/remove')
  @UseGuards(StrictAuthGuard)
  async removeBookmarkedPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() param: FindPostById,
  ) {
    const userId = req.user._id;
    const { postId } = param;
    const payload: IBookmarkPost = { userId, postId };

    const response = await this.service.removeBookmarkedPost(payload);
    return res.status(response.status).json(response);
  }
}
