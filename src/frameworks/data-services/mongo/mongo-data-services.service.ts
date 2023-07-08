import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts";
import { MongoGenericRepository } from "./mongo-generic-repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/modules/user/schemas/user.schema";
import { User } from "src/modules/user/entities/user.entity";
import { Post } from "src/modules/post/entities/post.entity";
import { PostDocument } from "src/modules/post/schemas/post.schema";
import { Likes } from "src/modules/post/entities/likes.entity";
import { LikesDocument } from "src/modules/post/schemas/likes.schema";
import { Comment } from "src/modules/comment/entities/comment.entity";
import { CommentDocument } from "src/modules/comment/schemas/comment.schema";

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
    users: MongoGenericRepository<User>
    post: MongoGenericRepository<Post>
    likes: MongoGenericRepository<Likes>
    comments: MongoGenericRepository<Comment>

    constructor(
        @InjectModel(User.name)
        private UserRepository: Model<UserDocument>,

        @InjectModel(Post.name)
        private PostRepository: Model<PostDocument>,

        @InjectModel(Likes.name)
        private LikesRepository: Model<LikesDocument>,

        @InjectModel(Comment.name)
        private CommentsRepository: Model<CommentDocument>
    )
    {}

    onApplicationBootstrap() {
        this.users = new MongoGenericRepository<User>(this.UserRepository)
        this.post = new MongoGenericRepository<Post>(this.PostRepository)
        this.likes = new MongoGenericRepository<Likes>(this.LikesRepository)
        this.comments = new MongoGenericRepository<Comment>(this.CommentsRepository)
    }
}