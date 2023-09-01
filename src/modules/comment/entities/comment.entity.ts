
export class Comment {
    comment: string
    user: string
    post: string
    replyTo?: string;
    isDeleted: boolean
    isAdminDeleted: boolean
    createdAt: Date
    updatedAt: Date
}