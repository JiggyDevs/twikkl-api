import { PaginationType } from "src/core/types/database";

export type IGetAllUsers = PaginationType & {
    _id: number
    username: string
    email: string
    password: string
    following: string[]
    groups: string[]
}