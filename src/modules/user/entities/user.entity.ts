export class User {
  username: string;
  email: string;
  password: string;
  following: string[];
  groups: string[];
  avatar: string;
  bio: string;
  twitter: string;
  lastLoginDate: Date;
  deviceToken: string;
  emailVerified: boolean;
  likesNotification: boolean;
  commentsNotification: boolean;
  followersNotification: boolean;
  mentionsNotification: boolean;
  repostNotification: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
