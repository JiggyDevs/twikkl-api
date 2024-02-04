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
import { Tags } from 'src/modules/post/entities/tags.entity';
import { TagsDocument } from 'src/modules/post/schemas/tags.schema';
import { Admin, AdminDocument } from 'src/modules/admin/schemas/admin.schema';
import {
  BookmarkedPost,
  BookmarkedPostDocument,
} from 'src/modules/post/schemas/bookmarked-post.schema';
// import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Wallet,
  WalletDocument,
} from 'src/modules/wallet/schemas/wallet.schema';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  users: MongoGenericRepository<User>;
  wallets: MongoGenericRepository<Wallet>;
  post: MongoGenericRepository<Post>;
  bookmarkedPost: MongoGenericRepository<BookmarkedPost>;
  group: MongoGenericRepository<Group>;
  likes: MongoGenericRepository<Likes>;
  comments: MongoGenericRepository<Comment>;
  notification: MongoGenericRepository<Notification>;
  followers: MongoGenericRepository<Followers>;
  categories: MongoGenericRepository<Category>;
  favoriteGroups: MongoGenericRepository<FavoriteGroups>;
  tags: MongoGenericRepository<Tags>;
  admin: MongoGenericRepository<Admin>;

  constructor(
    @InjectModel(User.name)
    private UserRepository: Model<UserDocument>,

    @InjectModel(Wallet.name)
    private WalletRepository: Model<WalletDocument>,

    @InjectModel(Post.name)
    private PostRepository: Model<PostDocument>,

    @InjectModel(BookmarkedPost.name)
    private BookmarkedPostRepository: Model<BookmarkedPostDocument>,

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

    @InjectModel(Tags.name)
    private TagsRepository: Model<TagsDocument>,

    @InjectModel(Admin.name)
    private AdminRepository: Model<AdminDocument>,
  ) {}

  onApplicationBootstrap() {
    this.users = new MongoGenericRepository<User>(this.UserRepository);
    this.wallets = new MongoGenericRepository<Wallet>(this.WalletRepository);
    this.post = new MongoGenericRepository<Post>(this.PostRepository);
    this.bookmarkedPost = new MongoGenericRepository<BookmarkedPost>(
      this.BookmarkedPostRepository,
    );
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
    this.tags = new MongoGenericRepository<Tags>(this.TagsRepository);
    this.admin = new MongoGenericRepository<Admin>(this.AdminRepository);
  }
}
