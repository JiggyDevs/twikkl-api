import { User } from "src/modules/user/entities/user.entity";
import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
    abstract users: IGenericRepository<User>
}