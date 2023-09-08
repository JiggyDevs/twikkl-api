import {
  Comment,
  CommentSchema,
} from 'src/modules/comment/schemas/comment.schema';
import {
  Followers,
  FollowersSchema,
} from 'src/modules/following/schemas/followers.schema';
import { Group, GroupSchema } from 'src/modules/group/schemas/group.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/modules/notifications/schemas/notification.schema';
import { Likes, LikesSchema } from 'src/modules/post/schemas/likes.schema';
import { Post, PostSchema } from 'src/modules/post/schemas/post.schema';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

export const SCHEMA_LIST = [
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Post.name,
    schema: PostSchema,
  },
  {
    name: Group.name,
    schema: GroupSchema,
  },
  {
    name: Likes.name,
    schema: LikesSchema,
  },
  {
    name: Comment.name,
    schema: CommentSchema,
  },
  {
    name: Notification.name,
    schema: NotificationSchema,
  },
  {
    name: Followers.name,
    schema: FollowersSchema,
  },
];
