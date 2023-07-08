import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ICreatePost, IDeletePost, IGetPost, IGetUserPosts, ILikePost } from './post.type';
import { OptionalQuery } from 'src/core/types/database';
import { Post } from './entities/post.entity';
import { PostFactoryService } from './post-factory-service.service';
import { DoesNotExistsException, ForbiddenRequestException, AlreadyExistsException } from 'src/lib/exceptions';
import { isEmpty } from 'src/lib/utils';
import { LikesFactoryService } from './likes-factory-service.service';
import { Likes } from './entities/likes.entity';

@Injectable()
export class PostService {
  constructor(
    private data: IDataServices,
    private postFactory: PostFactoryService,
    private likesFactory: LikesFactoryService
  ) 
  {}

  cleanGetUserPostsQuery(data: IGetUserPosts) {
    let key = {}

    if (data._id) key['_id'] = data._id
    if (data.contentUrl) key['contentUrl'] = data.contentUrl
    if (data.creator) key['creator'] = data.creator
    if (data.description) key['description'] = data.description
    if (data.group) key['group'] = data.group
    if (data.isAdminDeleted === false || data.isAdminDeleted) key['isAdminDeleted'] = data.isAdminDeleted
    if (data.isDeleted === false || data.isDeleted) key['isDeleted'] = data.isDeleted
    if (data.page) key['page'] = data.page
    if (data.perpage) key['perpage'] = data.perpage
    if (data.sort) key['sort'] = data.sort

    return key
  }

  async create(payload: ICreatePost) {
    try {
      const { contentUrl, description, userId, groupId } = payload

      const postPayload: OptionalQuery<Post> = {
        contentUrl,
        description,
        creator: userId,
        group: groupId ? groupId : null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const factory = this.postFactory.create(postPayload)
      const data = await this.data.post.create(factory)

      return {
        message: 'Post created successfully',
        data,
        status: HttpStatus.CREATED
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async getUserFeed(payload: IGetUserPosts) {
    try {
      const filterQuery = this.cleanGetUserPostsQuery(payload)

      const { data, pagination } = await this.data.post.findAllWithPagination(filterQuery)

      return {
        message: 'User Feed retrieved successfully',
        data,
        pagination,
        status: HttpStatus.OK
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async getUserPosts(payload: IGetUserPosts) {
    try {
      const filterQuery = this.cleanGetUserPostsQuery(payload)

      const data = await this.data.post.findAllWithPagination(filterQuery)

      return {
        message: 'User Posts retrieved successfully',
        data,
        status: HttpStatus.OK
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async deletePost(payload: IDeletePost) {
    try {
      const { postId, userId } = payload

      const post = await this.data.post.findOne({ _id: postId })
      if (!post) throw new DoesNotExistsException('Post not found')

      if (post.creator !== userId) throw new ForbiddenRequestException('Not permitted to perform this action')

      await this.data.post.update({ _id: post._id }, { $set: { isDeleted: true }})

      return {
        message: 'Post deleted',
        status: HttpStatus.OK
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async getPost(payload: IGetPost) {
    try {
      const { postId } = payload

      const post = await this.data.post.findOne({ _id: postId })
      if (!post) throw new DoesNotExistsException('Post not found')

      return {
        message: 'Post retrieved successfully',
        data: post,
        status: HttpStatus.OK
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async likePost(payload: ILikePost) {
    try {
      const { postId, userId } = payload

      const post = await this.data.post.findOne({ _id: postId })
      if (!post) throw new DoesNotExistsException('Post not found')

      const likedPost = await this.data.likes.findOne({ user: userId, post: postId })
      if (likedPost) throw new AlreadyExistsException('Already liked post')

      const likeFactoryPayload: OptionalQuery<Likes> = {
        post: postId,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const likeFactory = this.likesFactory.create(likeFactoryPayload)
      await this.data.likes.create(likeFactory)

      return {
        message: 'Post liked successfully',
        data: {},
        status: HttpStatus.OK
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  async unlikePost(payload: ILikePost) {
    try {
      const { postId, userId } = payload

      const post = await this.data.post.findOne({ _id: postId })
      if (!post) throw new DoesNotExistsException('Post not found')

      const likedPost = await this.data.likes.findOne({ user: userId, post: postId })
      if (!likedPost) throw new DoesNotExistsException('Liked post not found')

      await this.data.likes.delete({ _id: likedPost._id })

      return {
        message: 'Post unLiked successfully',
        data: {},
        status: HttpStatus.OK
      }

    } catch (error) {
      Logger.error(error)
      if (error.name === 'TypeError') throw new HttpException(error.message, 500)
      throw error
    }
  }

  // async findAll(pagination: PaginationCursorDto) {
  //   const { cursor, limit = 1 } = pagination;
  //   const query = cursor ? { _id: { $lt: cursor } } : {};
  //   const posts = await this.postModel
  //     .find(query)
  //     .sort({ _id: -1 })
  //     .limit(limit)
  //     .lean();
  //   const total = await this.postModel.countDocuments();
  //   return { data: posts, total, limit };
  // }

  // async findOne(id: string) {
  //   const post = await this.postModel.findById(id).lean();
  //   if (!post) {
  //     throw new Error('Post not found');
  //   }

  //   if (post.isDeleted || post.isAdminDeleted) {
  //     delete post.contentUrl;
  //     delete post.description;
  //   }
  //   return post;
  // }

  // async getUserFeed(userId: string): Promise<Post[]> {
  //   const user = await this.userModel.findById(userId).lean();
  //   console.log({
  //     user,
  //     userId,
  //   });
  //   const feedPosts = await this.postModel
  //     .find({
  //       $or: [
  //         // { author: userId }, // Include user's own posts
  //         {
  //           author: { $in: user.following.map((a) => a.toString()) },
  //           group: { $exists: false },
  //         }, // Include followed users' posts
  //         { group: { $in: user.groups, $exists: true } }, // Include followed users' posts
  //       ],
  //     })
  //     .exec();

  //   return feedPosts;
  // }

  // // async getUserFeed2(userId: string): Promise<Post[]> {
  // //   const userPosts = await this.postModel.find({ user: userId }).exec();

  // //   const groupPosts = await this.postModel
  // //     .find({ groupId: { $ne: null } })
  // //     .exec();

  // //   const feedPosts = [...userPosts, ...groupPosts];

  // //   return feedPosts;
  // // }

  // async likePost(id: string, user: string) {
  //   const post = await this.postModel.findById(id);
  //   // Remove the user from the likes array if they have already liked the post
  //   if (post.likes.includes(user)) {
  //     post.likes = post.likes.filter((like) => like !== user);
  //   } else {
  //     post.likes = [...post.likes, user];
  //   }
  //   await post.save();
  //   return post;
  // }

  // async replyPost(id: string, reply: CreatePostDto) {
  //   const post = await this.postModel.findById(id);
  //   if (!post) {
  //     throw new Error('Post not found');
  //   }
  //   const replyPost = new this.postModel({ ...reply, replyTo: id });
  //   await replyPost.save();
  //   return replyPost;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // async deletePost(id: string, user: string, isAdmin = false) {
  //   const post = await this.postModel.findById(id);
  //   if (!post) {
  //     throw new Error('Post not found');
  //   }
  //   if (post.creator.toString() !== user) {
  //     throw new Error('You are not the author of this post');
  //   }
  //   if (isAdmin) {
  //     post.isAdminDeleted = true;
  //   } else {
  //     post.isDeleted = true;
  //   }
  //   await post.save();
  //   return post;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
