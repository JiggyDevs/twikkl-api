import { Comment, CommentSchema } from "src/modules/comment/schemas/comment.schema";
import { Notification, NotificationSchema } from "src/modules/notifications/schemas/notification.schema";
import { Likes, LikesSchema } from "src/modules/post/schemas/likes.schema";
import { Post, PostSchema } from "src/modules/post/schemas/post.schema";
import { User, UserSchema } from "src/modules/user/schemas/user.schema";

export const SCHEMA_LIST = [
    {
        name: User.name, schema: UserSchema
    },
    {
        name: Post.name, schema: PostSchema
    },
    {
        name: Likes.name, schema: LikesSchema
    },
    {
        name: Comment.name, schema: CommentSchema
    },
    {
        name: Notification.name, schema: NotificationSchema
    }
]