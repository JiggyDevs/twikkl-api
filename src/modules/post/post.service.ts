import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationCursorDto } from './dto/pagination.dto';
import { GetPostDto } from './dto/get-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = new this.postModel(createPostDto);
    return await post.save();
  }

  async findAll(pagination: PaginationCursorDto) {
    const { cursor, limit = 1 } = pagination;
    const query = cursor ? { _id: { $lt: cursor } } : {};
    const posts = await this.postModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
    const total = await this.postModel.countDocuments();
    return { data: posts, total, limit };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).lean();
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.isDeleted || post.isAdminDeleted) {
      delete post.content;
      delete post.caption;
    }
    return post;
  }

  async getUserFeed(userId: string): Promise<Post[]> {
    const user = await this.userModel.findById(userId).lean();
    console.log({
      user,
      userId,
    });
    const feedPosts = await this.postModel
      .find({
        $or: [
          // { author: userId }, // Include user's own posts
          { author: { $in: user.following.map((a) => a.toString()) } }, // Include followed users' posts
          { group: { $in: user.groups, $exists: true } }, // Include followed users' posts
        ],
      })
      .exec();

    return feedPosts;
  }

  // async getUserFeed2(userId: string): Promise<Post[]> {
  //   const userPosts = await this.postModel.find({ user: userId }).exec();

  //   const groupPosts = await this.postModel
  //     .find({ groupId: { $ne: null } })
  //     .exec();

  //   const feedPosts = [...userPosts, ...groupPosts];

  //   return feedPosts;
  // }

  async likePost(id: string, user: string) {
    const post = await this.postModel.findById(id);
    // Remove the user from the likes array if they have already liked the post
    if (post.likes.includes(user)) {
      post.likes = post.likes.filter((like) => like !== user);
    } else {
      post.likes = [...post.likes, user];
    }
    await post.save();
    return post;
  }

  async replyPost(id: string, reply: CreatePostDto) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    const replyPost = new this.postModel({ ...reply, replyTo: id });
    await replyPost.save();
    return replyPost;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async deletePost(id: string, user: string, isAdmin = false) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    if (post.author.toString() !== user) {
      throw new Error('You are not the author of this post');
    }
    if (isAdmin) {
      post.isAdminDeleted = true;
    } else {
      post.isDeleted = true;
    }
    await post.save();
    return post;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
