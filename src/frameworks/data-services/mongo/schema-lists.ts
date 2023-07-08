// import { User } from "src/core/entities/user.entity";
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
    }
]