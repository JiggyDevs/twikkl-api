import { DateType, PaginationType } from "src/core/types/database";
import { CreatePostDto } from "./dto/create-post.dto";

export type ICreatePost = CreatePostDto & {
    userId: string
}

export type IGetUserPosts = PaginationType & {
    _id: string
    contentUrl: string
    description: string
    creator: string
    group: string
    isDeleted: boolean
    isAdminDeleted: boolean
}

export type IDeletePost = {
    postId: string
    userId: string
}

export type FindPostById = {
    postId: string
}

export type IGetPost = {
    postId: string
}

export type ILikePost = {
    postId: string
    userId: string
}

export type IGetLikes = {
    postId: string
}