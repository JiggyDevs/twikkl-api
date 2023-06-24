import { User } from "../entities/user.entity";
import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
    abstract users: IGenericRepository<User>
}