import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { MongoGenericRepository } from './mongo-generic-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import { User } from 'src/modules/user/entities/user.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { PostDocument } from 'src/modules/post/schemas/post.schema';
import { Likes } from 'src/modules/post/entities/likes.entity';
import { LikesDocument } from 'src/modules/post/schemas/likes.schema';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { CommentDocument } from 'src/modules/comment/schemas/comment.schema';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { NotificationDocument } from 'src/modules/notifications/schemas/notification.schema';
import { Followers } from 'src/modules/following/entities/followers.entites';
import { FollowersDocument } from 'src/modules/following/schemas/followers.schema';
import { GroupDocument } from 'src/modules/group/schemas/group.schema';
import { Group } from 'src/modules/group/entities/group.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { CategoryDocument } from 'src/modules/category/schemas/category.schema';
import { FavoriteGroups } from 'src/modules/group/entities/favorite-group.entity';
import { FavoriteGroupsDocument } from 'src/modules/group/schemas/favorite-group.schema';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  users: MongoGenericRepository<User>;
  post: MongoGenericRepository<Post>;
  group: MongoGenericRepository<Group>;
  likes: MongoGenericRepository<Likes>;
  comments: MongoGenericRepository<Comment>;
  notification: MongoGenericRepository<Notification>;
  followers: MongoGenericRepository<Followers>;
  categories: MongoGenericRepository<Category>;
  favoriteGroups: MongoGenericRepository<FavoriteGroups>;

  constructor(
    @InjectModel(User.name)
    private UserRepository: Model<UserDocument>,

    @InjectModel(Post.name)
    private PostRepository: Model<PostDocument>,

    @InjectModel(Group.name)
    private GroupRepository: Model<Group>,

    @InjectModel(Likes.name)
    private LikesRepository: Model<LikesDocument>,

    @InjectModel(Comment.name)
    private CommentsRepository: Model<CommentDocument>,

    @InjectModel(Notification.name)
    private NotificationRepository: Model<NotificationDocument>,

    @InjectModel(Followers.name)
    private FollowersRepository: Model<FollowersDocument>,

    @InjectModel(Category.name)
    private CategoryRepository: Model<CategoryDocument>,

    @InjectModel(FavoriteGroups.name)
    private FavoriteGroupsRepository: Model<FavoriteGroupsDocument>,
  ) {}

  onApplicationBootstrap() {
    this.users = new MongoGenericRepository<User>(this.UserRepository);
    this.post = new MongoGenericRepository<Post>(this.PostRepository);
    this.likes = new MongoGenericRepository<Likes>(this.LikesRepository);
    this.group = new MongoGenericRepository<Group>(this.GroupRepository);
    this.comments = new MongoGenericRepository<Comment>(
      this.CommentsRepository,
    );
    this.notification = new MongoGenericRepository<Notification>(
      this.NotificationRepository,
    );
    this.followers = new MongoGenericRepository<Followers>(
      this.FollowersRepository,
    );
    this.categories = new MongoGenericRepository<Category>(
      this.CategoryRepository,
    );
    this.favoriteGroups = new MongoGenericRepository<FavoriteGroups>(
      this.FavoriteGroupsRepository,
    );
  }
}
