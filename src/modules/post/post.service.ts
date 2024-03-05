import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import {
  ICreatePost,
  IDeletePost,
  IEditPost,
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
import { FirebaseService } from '../firebase/firebase.service';
import { Tags } from './entities/tags.entity';
import { TagsFactoryService } from './tags-factory.service';
import { isEmpty } from 'src/lib/utils';
import { PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    private data: IDataServices,
    private postFactory: PostFactoryService,
    private likesFactory: LikesFactoryService,
    private notificationFactory: NotificationFactoryService,
    private firebase: FirebaseService,
    private tagFactory: TagsFactoryService,
  ) {}

  cleanGetUserPostsQuery(data: IGetUserPosts) {
    const key: Partial<IGetUserPosts> = {};

    if (data._id) key._id = data._id;
    if (data.contentUrl) key.contentUrl = data.contentUrl;
    if (data.creator) key.creator = data.creator;
    if (data.description) key.description = data.description;
    if (data.group) key.group = data.group;
    if (data.isAdminDeleted === false || data.isAdminDeleted)
      key.isAdminDeleted = data.isAdminDeleted;
    if (data.allowDuet === false || data.allowDuet)
      key.allowDuet = data.allowDuet;
    if (data.allowStitch === false || data.allowStitch)
      key.allowStitch = data.allowStitch;
    if (data.isDeleted === false || data.isDeleted)
      key.isDeleted = data.isDeleted;
    if (data.user) key.user = data.user;
    if (data.page) key.page = data.page;
    if (data.perpage) key.perpage = data.perpage;
    if (data.sort) key.sort = data.sort;
    if (data.q) key.q = data.q;

    return key;
  }

  async create(payload: ICreatePost) {
    try {
      const {
        contentUrl,
        description,
        categoryId,
        tags,
        userId,
        groupId,
        visibility,
      } = payload;

      const postPayload: OptionalQuery<Post> = {
        contentUrl,
        description,
        category: categoryId,
        tags,
        creator: userId,
        group: groupId ? groupId : null,
        visibility: visibility ? visibility : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const factory = this.postFactory.create(postPayload);
      const data = await this.data.post.create(factory);

      if (tags && !isEmpty(tags)) {
        for (const tagName of tags) {
          const tag = await this.data.tags.findOne({ name: tagName });
          if (!tag) {
            const tagPayload: OptionalQuery<Tags> = {
              name: tagName,
              post: data._id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            const tagFactory = this.tagFactory.create(tagPayload);

            await this.data.tags.create(tagFactory);
          }
        }
      }

      const notificationPayload: OptionalQuery<Notification> = {
        title: 'Post uploaded',
        content: 'TwikkL post uploaded successfully',
        user: data.creator,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationFactory =
        this.notificationFactory.create(notificationPayload);

      // if (user && user.followersNotification && user.following.length > 0) {
      //   const followerIds = user.following;
      //   const notifications = [];
      //   for (const followerId of followerIds) {
      //     notifications.push({
      //       title: 'New Post by ' + user.username,
      //       content: 'Check out the latest post by ' + user.username,
      //       user: followerId,
      //       createdAt: new Date(),
      //       updatedAt: new Date(),
      //     });
      //   }
      //   await this.data.notification.insertMany(notifications);
      // }

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
      let filterQuery = this.cleanGetUserPostsQuery(payload);
      filterQuery['isDeleted'] = false;
      filterQuery['isAdminDeleted'] = false;

      const data = await this.data.likes.find({
        user: payload.user,
      });

      // const likedPostIds = data.map((like) => like.post);
      // const likedPosts = await this.data.post.find({
      //   _id: { $in: likedPostIds },
      // });

      // const likedCreators = likedPosts.map((post) => post.creator);
      // const likedGroups = likedPosts.map((post) => post.group);

      const { data: similarPosts, pagination } =
        await this.data.post.findAllWithPagination(
          {
            // _id: { $nin: likedPostIds },
            // tags: { $in: data.map((like) => like.tags) },

            ...filterQuery,
            // $or: [
            //   { creator: { $in: likedCreators } },
            //   { group: { $in: likedGroups } },
            // ],
          },
          { populate: 'creator' },
        );
      // Logger.log({ similarPosts, filterQuery });

      return {
        message: 'User Feed retrieved successfully',
        data: similarPosts,
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
      const filterQuery: any = this.cleanGetUserPostsQuery(payload);
      filterQuery['isDeleted'] = false;
      filterQuery['isAdminDeleted'] = false;

      if (filterQuery.q) {
        const { data, pagination } = await this.data.post.search(
          filterQuery,
          'creator',
        );

        return {
          message: 'User Posts retrieved successfully',
          data,
          pagination,
          status: HttpStatus.OK,
        };
      }

      const { data, pagination } = await this.data.post.findAllWithPagination(
        filterQuery,
        { populate: 'creator' },
      );

      return {
        message: 'User Posts retrieved successfully',
        data,
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

      const post = await this.data.post.findOne(
        {
          _id: postId,
          isDeleted: false,
        },
        null,
        { populate: 'creator' },
      );
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

      const post: PostDocument = await this.data.post.findOne({
        _id: postId,
        isAdminDeleted: false,
        isDeleted: false,
      });
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

      const [userDetails, ..._] = await Promise.all([
        this.data.users.findOne({ _id: userId }),
        this.data.likes.create(likeFactory),
        this.data.post.update(
          { _id: post?._id },
          {
            $set: {
              totalLikes: post.totalLikes + 1,
            },
          },
        ),
      ]);

      const notificationPayload: OptionalQuery<Notification> = {
        title: 'Post liked',
        content: 'TwikkL post liked',
        type: 'likes',
        user: userId,
        post: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const likedNotificationPayload: OptionalQuery<Notification> = {
        title: 'Post liked',
        content: `${userDetails.username} liked your video`,
        type: 'likes',
        user: post.creator,
        post: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationFactory =
        this.notificationFactory.create(notificationPayload);
      const likedNotificationFactory = this.notificationFactory.create(
        likedNotificationPayload,
      );

      await Promise.all([
        this.data.notification.create(notificationFactory),
        this.data.notification.create(likedNotificationFactory),
      ]);

      const sendNotification = await this.firebase.sendToUser(
        userDetails,
        'Like',
        `${userDetails.username} liked your video`,
      );
      Logger.log({ sendNotification });

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

      const post = await this.data.post.findOne({
        _id: postId,
        isAdminDeleted: false,
        isDeleted: false,
      });
      if (!post) throw new DoesNotExistsException('Post not found');

      const likedPost = await this.data.likes.findOne({
        user: userId,
        post: postId,
      });
      if (!likedPost) throw new DoesNotExistsException('Liked post not found');

      await Promise.all([
        this.data.likes.delete({ _id: likedPost._id }),
        this.data.post.update(
          { _id: post?._id },
          {
            $set: {
              totalLikes: Math.max(post.totalLikes - 1, 0),
            },
          },
        ),
      ]);

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

      const post = await this.data.post.findOne({
        _id: postId,
        isAdminDeleted: false,
        isDeleted: false,
      });
      if (!post) throw new DoesNotExistsException('Post not found');

      const likes = await this.data.likes.find(
        { post: postId },
        { isLean: true, populate: ['user', 'post'] },
      );

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

  async editPost(payload: IEditPost) {
    try {
      const { postId, allowDuet, allowStitch, visibility } = payload;

      const post = await this.data.post.findOne({
        _id: postId,
        isAdminDeleted: false,
        isDeleted: false,
      });
      if (!post) throw new DoesNotExistsException('Post not found.');

      const postPayload: OptionalQuery<Post> = {
        allowDuet,
        allowStitch,
        visibility,
      };

      await this.data.post.update(
        { _id: post._id },
        { $set: { ...postPayload } },
      );

      return {
        message: 'Post updated successfully',
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
