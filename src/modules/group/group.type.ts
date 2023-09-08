import { PaginationType } from "src/core/types/database"
import { CreateGroupDto } from "./dto/create-group.dto"


export type IGetGroups = PaginationType & {
   
}

export type IGetGroup = {
    groupId: string
}

export type IGetUserGroup = {
    userId: string
}


export type IGroupAction = {
    groupId: string;
     userId: string
}

export type ICreateGroup = CreateGroupDto & {
    creator: string
}