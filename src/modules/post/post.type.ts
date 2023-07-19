import { DateType, PaginationType } from 'src/core/types/database';
import { CreatePostDto } from './dto/create-post.dto';

export type ICreatePost = CreatePostDto & {
  userId: string;
  file: any;
};

export type IGetUserPosts = PaginationType & {
  _id: string;
  contentUrl: string;
  description: string;
  creator: string;
  group: string;
  isDeleted: boolean;
  isAdminDeleted: boolean;
};

export type IDeletePost = {
  postId: string;
  userId: string;
};

export type FindPostById = {
  postId: string;
};

export type IGetPost = {
  postId: string;
};

export type IPostActions = {
  postId: string;
  userId: string;
};

export type ILikePost = IPostActions & {};

export type IBookmarkPost = IPostActions & {};

export type IGetLikes = {
  postId: string;
};

export type IGetBookmarks = {
  userId: string;
};