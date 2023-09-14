import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  ICreateCategory,
  IGetAllCategories,
  IGetCategory,
  IRemoveCategory,
  IUpdateCategory,
} from './category.type';
import {
  AlreadyExistsException,
  DoesNotExistsException,
} from 'src/lib/exceptions';
import { OptionalQuery } from 'src/core/types/database';
import { Category } from './entities/category.entity';
import { CategoryFactoryService } from './category-factory.service';

@Injectable()
export class CategoryService {
  constructor(
    private data: IDataServices,
    private categoryFactory: CategoryFactoryService,
  ) {}

  cleanCategoriesQuery(data: IGetAllCategories) {
    let key = {};

    if (data.description) key['description'] = data.description;
    if (data._id) key['_id'] = data._id;
    if (data.name) key['name'] = data.name;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.sort) key['sort'] = data.sort;
  }

  async createCategory(payload: ICreateCategory) {
    try {
      const { name, description } = payload;

      const category = await this.data.categories.findOne({ name });
      if (category) throw new AlreadyExistsException('Category already exists');

      const categoryPayload: OptionalQuery<Category> = {
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.categoryFactory.create(categoryPayload);

      const data = await this.data.categories.create(factory);

      return {
        message: 'Category created successfully',
        data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getAllCategories(payload: IGetAllCategories) {
    try {
      const filterQuery = this.cleanCategoriesQuery(payload);

      const { data, pagination } =
        await this.data.categories.findAllWithPagination(filterQuery);

      return {
        message: 'Categories retrieved successfully',
        status: HttpStatus.OK,
        data,
        pagination,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getCategory(payload: IGetCategory) {
    try {
      const { _id } = payload;

      const data = await this.data.categories.findOne({ _id: _id });
      if (!data) throw new DoesNotExistsException('Category not found');

      return {
        message: 'Category retrieved successfully',
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async updateCategory(payload: IUpdateCategory) {
    try {
      const { admin, categoryId, name, description } = payload;

      const category = await this.data.categories.findOne({ _id: categoryId });
      if (!category) throw new DoesNotExistsException('Category not found');

      const categoryPayload = {
        name,
        description,
      };

      await this.data.categories.update(
        { _id: category._id },
        { $set: { ...categoryPayload, admin } },
      );

      return {
        message: 'Category updated successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async removeCategory(payload: IRemoveCategory) {
    try {
      const { categoryId } = payload;

      const category = await this.data.categories.findOne({ _id: categoryId });
      if (!category) throw new DoesNotExistsException('Category not found');

      await this.data.categories.delete({ _id: category._id });

      return {
        message: 'Category removed successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
