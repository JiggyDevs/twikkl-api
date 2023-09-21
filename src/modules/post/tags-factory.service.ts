import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { Tags } from './entities/tags.entity';

@Injectable()
export class TagsFactoryService {
  create(data: OptionalQuery<Tags>) {
    const tag = new Tags();

    if (data.name) tag.name = data.name;
    if (data.post) tag.post = data.post;
    if (data.createdAt) tag.createdAt = data.createdAt;
    if (data.updatedAt) tag.updatedAt = data.updatedAt;

    return tag;
  }
}
