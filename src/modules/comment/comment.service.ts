import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// import { CreateCommentDto } from './dto/create-comment.dto';
import { IDataServices } from 'src/core/abstracts';
import {
  ICommentOnPost,
  IDeleteComment,
  IGetComment,
  IGetPostComments,
} from './comment.type';
import {
  DoesNotExistsException,
  ForbiddenRequestException,
} from 'src/lib/exceptions';
import { CommentsFactoryService } from './comments-factory-service.service';
import { OptionalQuery } from 'src/core/types/database';
import { Comment } from './entities/comment.entity';
import { NotificationFactoryService } from '../notifications/notification-factory.service';
import { Notification } from '../notifications/entities/notification.entity';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { PostDocument } from '../post/schemas/post.schema';
import { CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    private data: IDataServices,
    private commentFactory: CommentsFactoryService,
    private notificationFactory: NotificationFactoryService,
    private firebase: FirebaseService,
  ) {}

  async createComment(payload: ICommentOnPost) {
    try {
      const { comment, postId, userId, replyTo } = payload;

      const post: PostDocument = await this.data.post.findOne({ _id: postId });
      if (!post) throw new DoesNotExistsException('Post not found');

      const commentPayload: OptionalQuery<Comment> = {
        comment,
        post: postId,
        user: userId,
        replyTo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const commentFactory = this.commentFactory.create(commentPayload);

      const [userDetails, data, _] = await Promise.all([
        this.data.users.findOne({ _id: userId }),
        this.data.comments.create(commentFactory),
        this.data.post.update(
          { _id: post?._id },
          {
            $set: {
              totalComments: post.totalComments + 1,
            },
          },
        ),
      ]);

      const notificationPayload: OptionalQuery<Notification> = {
        title: 'Comment posted',
        content: 'Commented on TwikkL post',
        type: 'comments',
        user: userId,
        post: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const commentNotificationPayload: OptionalQuery<Notification> = {
        title: 'Comment posted',
        content: `${userDetails.username} commented on your video`,
        type: 'comments',
        user: post.creator,
        post: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationFactory =
        this.notificationFactory.create(notificationPayload);
      const commentNotificationFactory = this.notificationFactory.create(
        commentNotificationPayload,
      );

      await Promise.all([
        this.data.notification.create(notificationFactory),
        this.data.notification.create(commentNotificationFactory),
      ]);
      const sendNotification = await this.firebase.sendToUser(
        userDetails,
        'Comment',
        `${userDetails.username} commented on your video`,
      );
      console.log({ sendNotification });

      return {
        message: 'Comment created successfully',
        data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getPostComments(payload: IGetPostComments) {
    try {
      const { postId } = payload;

      const post = await this.data.post.findOne({ _id: postId });
      if (!post) throw new DoesNotExistsException('Post not found');

      const { data, pagination } =
        await this.data.comments.findAllWithPagination(
          {
            post: postId,
            replyTo: null,
            isAdminDeleted: false,
            isDeleted: false,
          },
          { populate: ['user', 'post'] },
        );

      return {
        message: 'Comments retrieved successfully',
        data,
        pagination,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getRepliesToComment({ commentId }: { commentId: string }) {
    try {
      // Fetch all replies to the given comment
      const replies = await this.data.comments.findAllWithPagination(
        {
          replyTo: commentId,
          isDeleted: false,
          isAdminDeleted: false,
        },
        { populate: ['user', 'post'] },
      );

      return {
        message: 'Replies retrieved successfully',
        data: replies,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError') {
        throw new HttpException(error.message, 500);
      }
      throw error;
    }
  }

  async getComment(payload: IGetComment) {
    try {
      const { commentId } = payload;

      const comment = await this.data.comments.findOne(
        {
          _id: commentId,
          isDeleted: false,
          isAdminDeleted: false,
        },
        undefined,
        { populate: ['user', 'post'] },
      );
      if (!comment) throw new DoesNotExistsException('Comment not found');

      return {
        message: 'Comment retrieved successfully',
        data: comment,
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async deleteComment(payload: IDeleteComment) {
    try {
      const { commentId, userId } = payload;

      const comment: any = await this.data.comments.findOne(
        { _id: commentId },
        null,
        {
          populate: 'post',
        },
      );
      if (!comment) throw new DoesNotExistsException('Comment not found');

      if (comment.user !== userId)
        throw new ForbiddenRequestException(
          'Not permitted to perform this action',
        );

      await Promise.all([
        this.data.comments.update(
          { _id: comment._id },
          { $set: { isDeleted: true } },
        ),
        this.data.post.update(
          { _id: comment.post._id },
          {
            $set: {
              totalComments: Math.max(comment.post.totalComments - 1, 0),
            },
          },
        ),
      ]);

      return {
        message: 'Comment deleted',
        data: {},
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
