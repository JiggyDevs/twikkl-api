import { CreateCommentDto } from "./dto/create-comment.dto";

export type ICommentOnPost = CreateCommentDto & {
    postId: string
    userId: string
}

export type IGetPostComments = {
    postId: string
}

export type IGetComment = {
    commentId: string
}

export type FindCommentById = {
    commentId: string
}

export type IDeleteComment = {
    commentId: string
    userId: string
}