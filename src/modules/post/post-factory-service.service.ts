import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { Post } from './entities/post.entity';

@Injectable()
export class PostFactoryService {
  create(data: OptionalQuery<Post>) {
    const post = new Post();
    if (data.contentUrl) post.contentUrl = data.contentUrl;
    if (data.creator) post.creator = data.creator;
    if (data.category) post.category = data.category;
    if (data.description) post.description = data.description;
    if (data.group) post.group = data.group;
    if (data.isAdminDeleted === false || data.isAdminDeleted)
      post.isAdminDeleted = data.isAdminDeleted;
    if (data.isDeleted === false || data.isDeleted)
      post.isDeleted = data.isDeleted;
    if (data.allowDuet === false || data.allowDuet)
      post.allowDuet = data.allowDuet;
    if (data.allowStitch === false || data.allowStitch)
      post.allowStitch = data.allowStitch;
    if (data.visibility) post.visibility = data.visibility;
    if (data.tags) post.tags = data.tags;
    // if (data.likes) post.likes = data.likes
    if (data.createdAt) post.createdAt = data.createdAt;
    if (data.updatedAt) post.updatedAt = data.updatedAt;

    return post;
  }
}
