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
  totalLikes: number;
  totalComments: number;
  createdAt: Date;
  updatedAt: Date;
}
