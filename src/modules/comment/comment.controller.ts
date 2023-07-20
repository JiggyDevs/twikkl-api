import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Request, Response } from 'express';
import { FindPostById } from '../post/post.type';
import { FindCommentById, ICommentOnPost, IDeleteComment, IGetComment, IGetPostComments } from './comment.type';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly service: CommentService
    ) 
    {}

  @Post('/:postId')
  @UseGuards(StrictAuthGuard)
  async createComment(@Req() req: Request, @Res() res: Response, @Body() body: CreateCommentDto, @Param() param: FindPostById) {
    const userId = req.user._id
    const { postId } = param
    const payload: ICommentOnPost = { userId, postId, ...body }
    
    const response = await this.service.createComment(payload)
    return res.status(response.status).json(response)
  }

  @Get('/:postId')
  @UseGuards(StrictAuthGuard)
  async getPostComments(@Res() res: Response, @Param() param: FindPostById) {
    const { postId } = param
    const payload: IGetPostComments = { postId }

    const response = await this.service.getPostComments(payload)
    return res.status(response.status).json(response)
  }

  @Get('/comment/:commentId')
  @UseGuards(StrictAuthGuard)
  async getComment(@Res() res: Response, @Param() param: FindCommentById) {
    const { commentId } = param
    const payload: IGetComment = { commentId }

    const response = await this.service.getComment(payload)
    return res.status(response.status).json(response)
  }

  @Patch('/comment/:commentId')
  @UseGuards(StrictAuthGuard)
  async deleteComment(@Req() req: Request, @Res() res: Response, @Param() param: FindCommentById) {
    const userId = req.user._id
    const { commentId } = param
    const payload: IDeleteComment = { userId, commentId }

    const response = await this.service.deleteComment(payload)
    return res.status(response.status).json(response)
  }

  // @Get()
  // async getCommentsByPostId(@Query('post', ParseIntPipe) postId: string) {
  //   return this.commentService.getCommentsByPostId(postId);
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: string) {
  //   return this.commentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: string) {
  //   return this.commentService.remove(+id);
  // }
}
