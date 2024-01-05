import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  IAddPostToBookmarks,
  ICreatePost,
  IGetAllUserBookmarks,
  IGetUserPosts,
} from './post.type';
import { DoesNotExistsException } from 'src/lib/exceptions';
import { BookmarkedPostFactoryService } from './bookmarked-post.factory';
import { OptionalQuery } from 'src/core/types/database';
import { BookmarkedPost } from './entities/bookmarked-post.entity';

@Injectable()
export class BookmarkedPostService {
  constructor(
    private data: IDataServices,
    private bookmarkedPostFactory: BookmarkedPostFactoryService,
  ) {}

  cleanBookmarkedPostQuery(data: IGetAllUserBookmarks) {
    let key = {};

    if (data._id) key['_id'] = data._id;
    if (data.post) key['post'] = data.post;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.sort) key['sort'] = data.sort;

    return key;
  }

  async addPostToBookmark(payload: IAddPostToBookmarks) {
    try {
      const { postId, userId } = payload;

      const [post, bookmarkedPost] = await Promise.all([
        this.data.post.findOne({
          _id: postId,
        }),
        this.data.bookmarkedPost.findOne({
          post: postId,
          user: userId,
        }),
      ]);
      if (!post) throw new DoesNotExistsException('Post does not exist');
      if (bookmarkedPost)
        throw new DoesNotExistsException('Post has been marked');

      const bookmarkedPostPayload: BookmarkedPost = {
        post: postId,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.bookmarkedPostFactory.create(bookmarkedPostPayload);
      const data = await this.data.bookmarkedPost.create(factory);
      return {
        message: 'Post added to favorites',
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

  async getAllUserBookmarkedPost(payload: IGetAllUserBookmarks) {
    try {
      const filterQuery = this.cleanBookmarkedPostQuery(payload);

      const { data, pagination } =
        await this.data.bookmarkedPost.findAllWithPagination(filterQuery);

      return {
        message: 'Favorite posts retrieved successfully',
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

  async removePostFromBookmarks(payload: any) {
    try {
      const { postId, userId } = payload;

      const post = await this.data.bookmarkedPost.findOne({
        post: postId,
        user: userId,
      });
      if (!post)
        throw new DoesNotExistsException('Post not found in favorite posts');

      await this.data.bookmarkedPost.delete({ post: postId, user: userId });

      return {
        message: 'Post removed from favorites',
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
