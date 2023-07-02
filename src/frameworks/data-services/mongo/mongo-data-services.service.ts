import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts";
import { MongoGenericRepository } from "./mongo-generic-repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/modules/user/schemas/user.schema";
import { User } from "src/modules/user/entities/user.entity";

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
    users: MongoGenericRepository<User>

    constructor(
        @InjectModel(User.name)
        private UserRepository: Model<UserDocument>
    )
    {}

    onApplicationBootstrap() {
        this.users = new MongoGenericRepository<User>(this.UserRepository)
    }
}