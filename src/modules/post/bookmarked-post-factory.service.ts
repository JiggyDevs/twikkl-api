import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { BookmarkedPost } from './entities/bookmarked-post.entity';

@Injectable()
export class BookmarkedPostFactoryService {
  create(data: OptionalQuery<BookmarkedPost>) {
    const bookmarkedPost = new BookmarkedPost();
    if (data.post) bookmarkedPost.post = data.post;
    if (data.user) bookmarkedPost.user = data.user;
    if (data.createdAt) bookmarkedPost.createdAt = data.createdAt;
    if (data.updatedAt) bookmarkedPost.updatedAt = data.updatedAt;

    return bookmarkedPost;
  }
}
