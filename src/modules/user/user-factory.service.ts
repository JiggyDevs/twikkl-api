import { Injectable } from "@nestjs/common";
import { OptionalQuery } from "src/core/types/database";
import { User } from "./entities/user.entity";

@Injectable()
export class UserFactoryService {
    create(data: OptionalQuery<User>) {
        const user = new User()
        if (data.email) user.email = data.email
        if (data.following) user.following = data.following
        if (data.groups) user.groups = data.groups
        if (data.password) user.password = data.password
        if (data.username) user.username = data.username
        if (data.lastLoginDate) user.lastLoginDate = data.lastLoginDate
        if (data.createdAt) user.createdAt = data.createdAt
        if (data.updatedAt) user.updatedAt = data.updatedAt


        return user
    }
}