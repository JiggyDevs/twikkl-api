import { Injectable } from '@nestjs/common';
import { OptionalQuery } from 'src/core/types/database';
import { User } from './entities/user.entity';

@Injectable()
export class UserFactoryService {
  create(data: OptionalQuery<User>) {
    const user = new User();
    if (data.email) user.email = data.email;
    if (data.following) user.following = data.following;
    if (data.groups) user.groups = data.groups;
    if (data.password) user.password = data.password;
    if (data.username) user.username = data.username;
    if (data.lastLoginDate) user.lastLoginDate = data.lastLoginDate;
    if (data.avatar) user.avatar = data.avatar;
    if (data.bio) user.bio = data.bio;
    if (data.twitter) user.twitter = data.twitter;
    if (data.deviceToken) user.deviceToken = data.deviceToken;
    if (data.emailVerified) user.emailVerified = data.emailVerified;
    if (data.likesNotification === false || data.likesNotification)
      user.likesNotification = data.likesNotification;
    if (data.commentsNotification === false || data.commentsNotification)
      user.commentsNotification = data.commentsNotification;
    if (data.followersNotification === false || data.followersNotification)
      user.followersNotification = data.followersNotification;
    if (data.mentionsNotification === false || data.mentionsNotification)
      user.mentionsNotification = data.mentionsNotification;
    if (data.repostNotification === false || data.repostNotification)
      user.repostNotification = data.repostNotification;
    if (data.createdAt) user.createdAt = data.createdAt;
    if (data.updatedAt) user.updatedAt = data.updatedAt;

    return user;
  }
}
