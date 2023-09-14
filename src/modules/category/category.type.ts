import { DateType, PaginationType } from 'src/core/types/database';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export type ICreateCategory = CreateCategoryDto & {
  admin?: string;
};

export type IGetAllCategories = PaginationType &
  DateType & {
    _id: string;
    name: string;
    description: string;
  };

export type IGetCategory = {
  _id: string;
};

export type FindByCategoryId = {
  categoryId: string;
};

export type IUpdateCategory = UpdateCategoryDto & {
  categoryId: string;
  admin?: string;
};

export type IRemoveCategory = {
  categoryId: string;
};
