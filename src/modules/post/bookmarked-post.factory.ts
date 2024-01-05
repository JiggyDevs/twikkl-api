import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { BookmarkedPost } from './entities/bookmarked-post.entity';

@Injectable()
export class BookmarkedPostFactoryService {
  create(data: OptionalQuery<BookmarkedPost>) {
    const favoriteGroup = new BookmarkedPost();

    if (data.post) favoriteGroup.post = data.post;
    if (data.user) favoriteGroup.user = data.user;
    if (data.createdAt) favoriteGroup.createdAt = data.createdAt;
    if (data.updatedAt) favoriteGroup.updatedAt = data.updatedAt;

    return favoriteGroup;
  }
}
