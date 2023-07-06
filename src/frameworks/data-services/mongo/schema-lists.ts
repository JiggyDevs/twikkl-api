// import { User } from "src/core/entities/user.entity";
import { Post, PostSchema } from "src/modules/post/schemas/post.schema";
import { User, UserSchema } from "src/modules/user/schemas/user.schema";

export const SCHEMA_LIST = [
    {
        name: User.name, schema: UserSchema
    },
    {
        name: Post.name, schema: PostSchema
    }
]