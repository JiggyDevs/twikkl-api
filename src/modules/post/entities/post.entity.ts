export class Post {
  contentUrl: string;
  description: string;
  creator: string;
  category: string;
  tags: string[]; //Hashtags
  group: string;
  isDeleted: boolean;
  isAdminDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
