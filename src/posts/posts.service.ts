import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto) {
    const post = new this.postModel(createPostDto);
    return await post.save();
  }

  async findAll() {
    const posts = await this.postModel.find();
    return posts;
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
