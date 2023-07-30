import { PaginationType } from "src/core/types/database"
import { FollowUserDto, UnFollowUserDto } from "./dto/followerUser.dto"

export type IFollowAUser = FollowUserDto & {
    userId: string
}

export type IUnFollowUser = UnFollowUserDto & {
    userId: string
}

export type IGetAllFollowers = PaginationType & {
    _id: string
    follower: string
    user: string
}

export type FindByUserIdDto = {
    userId: string
}