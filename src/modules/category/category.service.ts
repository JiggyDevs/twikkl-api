import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Category[]> {
    return this.categoryModel.find({ $text: { $search: name } }).exec();
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(category);
    return newCategory.save();
  }

  async update(id: string, category: UpdateCategoryDto): Promise<Category> {
    return this.categoryModel
      .findByIdAndUpdate(id, category, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndRemove(id).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
