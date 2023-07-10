import { Injectable } from "@nestjs/common";
import { OptionalQuery } from "src/core/types/database";
import { Likes } from "./entities/likes.entity";

@Injectable()
export class LikesFactoryService {
    create(data: OptionalQuery<Likes>) {
        const likes = new Likes()
        if (data.post) likes.post = data.post
        if (data.user) likes.user = data.user
        if (data.createdAt) likes.createdAt = data.createdAt
        if (data.updatedAt) likes.updatedAt = data.updatedAt


        return likes
    }
}