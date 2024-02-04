import { User } from 'src/modules/user/entities/user.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { IGenericRepository } from './generic-repository.abstract';
import { Post } from 'src/modules/post/entities/post.entity';
import { BookmarkedPost } from 'src/modules/post/entities/bookmarked-post.entity';
import { Likes } from 'src/modules/post/entities/likes.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Followers } from 'src/modules/following/entities/followers.entites';
import { Group } from 'src/modules/group/entities/group.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { FavoriteGroups } from 'src/modules/group/entities/favorite-group.entity';
import { Tags } from 'src/modules/post/entities/tags.entity';
import { Admin } from 'src/modules/admin/entities/admin.entity';

export abstract class IDataServices {
  abstract users: IGenericRepository<User>;
  abstract wallets: IGenericRepository<Wallet>;
  abstract post: IGenericRepository<Post>;
  abstract bookmarkedPost: IGenericRepository<BookmarkedPost>;
  abstract group: IGenericRepository<Group>;
  abstract likes: IGenericRepository<Likes>;
  abstract comments: IGenericRepository<Comment>;
  abstract notification: IGenericRepository<Notification>;
  abstract followers: IGenericRepository<Followers>;
  abstract categories: IGenericRepository<Category>;
  abstract favoriteGroups: IGenericRepository<FavoriteGroups>;
  abstract tags: IGenericRepository<Tags>;
  abstract admin: IGenericRepository<Admin>;
}
