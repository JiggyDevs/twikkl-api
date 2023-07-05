// import { User } from "src/core/entities/user.entity";
import { User, UserSchema } from "src/modules/user/schemas/user.schema";

export const SCHEMA_LIST = [
    {
        name: User.name, schema: UserSchema
    }
]