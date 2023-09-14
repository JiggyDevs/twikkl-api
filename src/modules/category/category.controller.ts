import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import {
  FindByCategoryId,
  ICreateCategory,
  IGetAllCategories,
  IGetCategory,
  IRemoveCategory,
  IUpdateCategory,
} from './category.type';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post('/')
  async createCategory(@Res() res: Response, @Body() body: CreateCategoryDto) {
    const payload: ICreateCategory = { ...body };

    const response = await this.service.createCategory(payload);
    return res.status(response.status).json(response);
  }

  @Get('/')
  async getAllCategories(@Res() res: Response, @Query() query: any) {
    const payload: IGetAllCategories = { ...query };

    const response = await this.service.getAllCategories(payload);
    return res.status(response.status).json(response);
  }

  @Get('/:categoryId')
  async getCategory(@Res() res: Response, @Param() params: FindByCategoryId) {
    const { categoryId } = params;
    const payload: IGetCategory = { _id: categoryId };

    const response = await this.service.getCategory(payload);
    return res.status(response.status).json(response);
  }

  @Patch('/:categoryId')
  async updateCategory(
    @Res() res: Response,
    @Body() body: UpdateCategoryDto,
    @Param() params: FindByCategoryId,
  ) {
    const { categoryId } = params;
    const payload: IUpdateCategory = { categoryId, ...body };

    const response = await this.service.updateCategory(payload);
    return res.status(response.status).json(response);
  }

  @Delete('/;categoryId')
  async removeCategory(
    @Res() res: Response,
    @Param() params: FindByCategoryId,
  ) {
    const { categoryId } = params;
    const payload: IRemoveCategory = { categoryId };

    const response = await this.service.removeCategory(payload);
    return res.status(response.status).json(response);
  }
}
