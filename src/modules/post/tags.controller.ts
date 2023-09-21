import { Controller, Get, Query, Res } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Response } from 'express';
import { IGetTags } from './post.type';

@Controller('/tags')
export class TagsController {
  constructor(private service: TagsService) {}

  @Get('/')
  async getTags(@Res() res: Response, @Query() query: any) {
    const payload: IGetTags = { ...query };

    const response = await this.service.getTags(payload);
    return res.status(response.status).json(response);
  }
}
