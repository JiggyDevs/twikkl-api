import { DEVICE_TYPE, VERIFICATION_VALUE_TYPE, USER_LOCK, USER_SIGNUP_STATUS_TYPE, USER_TYPE, API_VERSIONS } from "src/lib/constants"

export class User {
    username: string
    email: string
    password: string
    following: string[]
    groups: string[]
}