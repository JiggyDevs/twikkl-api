import { User } from "src/modules/user/entities/user.entity";
import { IGenericRepository } from "./generic-repository.abstract";
import { Post } from "src/modules/post/entities/post.entity";
import { Likes } from "src/modules/post/entities/likes.entity";
import { Comment } from "src/modules/comment/entities/comment.entity";
import { Notification } from "src/modules/notifications/entities/notification.entity";
import { Followers } from "src/modules/following/entities/followers.entites";

export abstract class IDataServices {
    abstract users: IGenericRepository<User>
    abstract post: IGenericRepository<Post>
    abstract likes: IGenericRepository<Likes>
    abstract comments: IGenericRepository<Comment>
    abstract notification: IGenericRepository<Notification>
    abstract followers: IGenericRepository<Followers>
}