import { IsArray, IsNotEmpty } from "class-validator";

export class MarkAllNotificationsDto {
    @IsNotEmpty()
    @IsArray()
    notificationIds: string[]
}