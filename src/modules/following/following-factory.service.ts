import { Injectable } from "@nestjs/common";
import { OptionalQuery } from "src/core/types/database";
import { Followers } from "./entities/followers.entites";

@Injectable()
export class FollowingFactoryService{
    create(data: OptionalQuery<Followers>) {
        const follower = new Followers()

        if (data.follower) follower.follower = data.follower
        if (data.user) follower.user = data.user
        if (data.createdAt) follower.createdAt = data.createdAt
        if (data.updatedAt) follower.updatedAt = data.updatedAt


        return follower
    }
}