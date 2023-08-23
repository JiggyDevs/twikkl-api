import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  ICreatePost,
  IDeletePost,
  IGetLikes,
  IGetPost,
  IGetUserPosts,
  ILikePost,
} from './post.type';
import { OptionalQuery } from 'src/core/types/database';
import { Post } from './entities/post.entity';
import { PostFactoryService } from './post-factory-service.service';
import {
  DoesNotExistsException,
  ForbiddenRequestException,
  AlreadyExistsException,
} from 'src/lib/exceptions';
import { LikesFactoryService } from './likes-factory-service.service';
import { Likes } from './entities/likes.entity';
import { NotificationFactoryService } from '../notifications/notification-factory.service';
import { Notification } from '../notifications/entities/notification.entity';
import { User } from '../user/entities/user.entity';
// import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class PostService {
  constructor(
    private data: IDataServices,
    private postFactory: PostFactoryService,
    private likesFactory: LikesFactoryService,
    private notificationFactory: NotificationFactoryService,
  ) // private firebase: FirebaseService,
  {}

  cleanGetUserPostsQuery(data: IGetUserPosts) {
    let key = {};

    if (data._id) key['_id'] = data._id;
    if (data.contentUrl) key['contentUrl'] = data.contentUrl;
    if (data.creator) key['creator'] = data.creator;
    if (data.description) key['description'] = data.description;
    if (data.group) key['group'] = data.group;
    if (data.isAdminDeleted === false || data.isAdminDeleted)
      key['isAdminDeleted'] = data.isAdminDeleted;
    if (data.isDeleted === false || data.isDeleted)
      key['isDeleted'] = data.isDeleted;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.sort) key['sort'] = data.sort;

    return key;
  }

  async create(payload: ICreatePost) {
    try {
      const { contentUrl, description, userId, groupId } = payload;
      const postPayload: OptionalQuery<Post> = {
        contentUrl,
        description,
        creator: userId,
        group: groupId ? groupId : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.postFactory.create(postPayload);
      const data = await this.data.post.create(factory);

      const notificationPayload: OptionalQuery<Notification> = {
        title: 'Post uploaded',
        content: 'TwikkL post uploaded successfully',
        user: data.creator,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationFactory =
        this.notificationFactory.create(notificationPayload);
      await this.data.notification.create(notificationFactory);

      //Could send a general message to users followers

      return {
        message: 'Post created successfully',
        data,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getUserFeed(payload: IGetUserPosts) {
    try {
      const filterQuery = this.cleanGetUserPostsQuery(payload);

      const { data, pagination } = await this.data.post.findAllWithPagination(
        filterQuery,
      );

      let returnedData = [];

      for (let i = 0; i < data.length; i++) {
        const postId = data[i]._id.toString();
        const likes = await this.data.likes.find({ post: postId });
        const comments = await this.data.comments.find({ post: postId });

        const newData = {
          ...data[i]._doc,
          likes,
          comments,
        };

        returnedData.push(newData);
      }

      return {
        message: 'User Feed retrieved successfully',
        data: returnedData,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getUserPosts(payload: IGetUserPosts) {
    try {
      const filterQuery = this.cleanGetUserPostsQuery(payload);

      const { data, pagination } = await this.data.post.findAllWithPagination(
        filterQuery,
      );

      let returnedData = [];

      for (let i = 0; i < data.length; i++) {
        const postId = data[i]._id.toString();
        const likes = await this.data.likes.find({ post: postId });
        const comments = await this.data.comments.find({ post: postId });

        const newData = {
          ...data[i]._doc,
          likes,
          comments,
        };

        returnedData.push(newData);
      }

      return {
        message: 'User Posts retrieved successfully',
        data: returnedData,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async deletePost(payload: IDeletePost) {
    try {
      const { postId, userId } = payload;

      const post = await this.data.post.findOne({ _id: postId });
      if (!post) throw new DoesNotExistsException('Post not found');

      if (post.creator !== userId)
        throw new ForbiddenRequestException(
          'Not permitted to perform this action',
        );

      await this.data.post.update(
        { _id: post._id },
        { $set: { isDeleted: true } },
      );

      return {
        message: 'Post deleted',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getPost(payload: IGetPost) {
    try {
      const { postId } = payload;

      const post = await this.data.post.findOne({
        _id: postId,
        isDeleted: false,
      });
      if (!post) throw new DoesNotExistsException('Post not found');

      return {
        message: 'Post retrieved successfully',
        data: post,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async likePost(payload: ILikePost) {
    try {
      const { postId, userId } = payload;

      const post: Post = await this.data.post.findOne({ _id: postId });
      if (!post) throw new DoesNotExistsException('Post not found');

      const likedPost = await this.data.likes.findOne({
        user: userId,
        post: postId,
      });
      if (likedPost) throw new AlreadyExistsException('Already liked post');

      const likeFactoryPayload: OptionalQuery<Likes> = {
        post: postId,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const likeFactory = this.likesFactory.create(likeFactoryPayload);
      await this.data.likes.create(likeFactory);

      const userDetails: User = await this.data.users.findOne({ _id: userId });

      const notificationPayload: OptionalQuery<Notification> = {
        title: 'Post liked',
        content: 'TwikkL post liked',
        type: 'likes',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const likedNotificationPayload: OptionalQuery<Notification> = {
        title: 'Post liked',
        content: `${userDetails.username} liked your video`,
        type: 'likes',
        user: post.creator,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationFactory =
        this.notificationFactory.create(notificationPayload);
      const likedNotificationFactory = this.notificationFactory.create(
        likedNotificationPayload,
      );

      await this.data.notification.create(notificationFactory);
      await this.data.notification.create(likedNotificationFactory);

      // const sendNotification = await this.firebase.sendToUser(
      //   userDetails,
      //   'Like',
      //   `${userDetails.username} liked your video`,
      // );
      // console.log({ sendNotification });

      return {
        message: 'Post liked successfully',
        data: {},
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async unlikePost(payload: ILikePost) {
    try {
      const { postId, userId } = payload;

      const post = await this.data.post.findOne({ _id: postId });
      if (!post) throw new DoesNotExistsException('Post not found');

      const likedPost = await this.data.likes.findOne({
        user: userId,
        post: postId,
      });
      if (!likedPost) throw new DoesNotExistsException('Liked post not found');

      await this.data.likes.delete({ _id: likedPost._id });

      return {
        message: 'Post unLiked successfully',
        data: {},
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getLikes(payload: IGetLikes) {
    try {
      const { postId } = payload;

      const post = await this.data.post.findOne({ _id: postId });
      if (!post) throw new DoesNotExistsException('Post not found');

      const likes = await this.data.likes.find({ post: postId });

      return {
        message: 'Likes retrieved successfully',
        data: likes,
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
