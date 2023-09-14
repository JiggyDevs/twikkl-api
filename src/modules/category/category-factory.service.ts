import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryFactoryService {
  create(data: OptionalQuery<Category>) {
    const category = new Category();

    if (data.name) category.name = data.name;
    if (data.description) category.description = data.description;
    if (data.createdAt) category.createdAt = data.createdAt;
    if (data.updatedAt) category.updatedAt = data.updatedAt;

    return category;
  }
}
