import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BookmarkedPostService } from './bookmarked-post.service';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Request, Response } from 'express';
import { IAddPostToBookmarks, IGetAllUserBookmarks } from './post.type';
import { AddPostToBookmarksDto } from './dto/create-post.dto';

@Controller('/posts/bookmarks')
export class BookmarkedPostController {
  constructor(private service: BookmarkedPostService) {}

  @Post('/:postId')
  @UseGuards(StrictAuthGuard)
  async addpostToFavorites(
    @Res() res: Response,
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    const userId = req.user._id;
    const payload: IAddPostToBookmarks = { postId, userId };

    const response = await this.service.addPostToBookmark(payload);
    return res.status(response.status).json(response);
  }

  @Get('/')
  @UseGuards(StrictAuthGuard)
  async getAllUserBookmarkedPost(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { user: userId };
    const payload: IGetAllUserBookmarks = { ...query };

    const response = await this.service.getAllUserBookmarkedPost(payload);
    return res.status(response.status).json(response);
  }

  @Delete('/:postId')
  @UseGuards(StrictAuthGuard)
  async removepostFromFavorites(
    @Req() req: Request,
    @Res() res: Response,
    @Param('postId') postId: string,
  ) {
    const userId = req.user._id;
    const payload = { postId, userId };

    const response = await this.service.removePostFromBookmarks(payload);
    return res.status(response.status).json(response);
  }
}
