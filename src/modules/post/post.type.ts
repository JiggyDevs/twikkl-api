import { DateType, PaginationType } from 'src/core/types/database';
import { AddTagDto, CreatePostDto, EditPostDto } from './dto/create-post.dto';

export type ICreatePost = CreatePostDto & {
  userId: string;
  // file: any
};

export type IGetUserPosts = PaginationType & {
  _id: string;
  contentUrl: string;
  description: string;
  creator: string;
  group: string;
  isDeleted: boolean;
  isAdminDeleted: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  user: string;
  q: string;
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

export type ILikePost = {
  postId: string;
  userId: string;
};

export type IGetLikes = {
  postId: string;
};

export type IAddTag = AddTagDto & {};

export type IGetTags = PaginationType &
  DateType & {
    _id: string;
    post: string;
    name: string;
  };

export type IEditPost = EditPostDto & {
  postId: string;
};

export enum PostVisibilityEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FOLLOWERS_ONLY = 'followers-only',
}
