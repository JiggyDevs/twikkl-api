import { Injectable } from "@nestjs/common";
import { OptionalQuery } from "src/core/types/database";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentsFactoryService {
    create(data: OptionalQuery<Comment>) {
        const comment = new Comment()
        if (data.comment) comment.comment = data.comment
        if (data.createdAt) comment.createdAt = data.createdAt
        if (data.isAdminDeleted === false || data.isAdminDeleted) comment.isAdminDeleted = data.isAdminDeleted
        if (data.isDeleted === false || data.isDeleted) comment.isDeleted = data.isDeleted
        if (data.post) comment.post = data.post
        if (data.updatedAt) comment.updatedAt = data.updatedAt
        if (data.user) comment.user = data.user
        
        
        return comment
    }
}