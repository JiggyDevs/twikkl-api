export class Post {
  contentUrl: string;
  description: string;
  creator: string;
  category: string;
  group: string;
  isDeleted: boolean;
  isAdminDeleted: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  visibility: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
