import { VERIFICATION_VALUE_TYPE, USER_LOCK, USER_SIGNUP_STATUS_TYPE, USER_TYPE, API_VERSIONS, DEVICE_TYPE } from "src/lib/constants"

export class User {

    email?: string
  
    device?: DEVICE_TYPE
  
    deviceToken?: string
  
    firstName?: string
  
    lastName?: string
  
    state?: string
  
    password?: string
  
    agreedToTerms?: VERIFICATION_VALUE_TYPE
  
    country?: string
  
    isAdmin?: VERIFICATION_VALUE_TYPE
  
    emailVerified?: VERIFICATION_VALUE_TYPE
  
    phoneVerified?: VERIFICATION_VALUE_TYPE
  
    lastLoginDate?: Date
  
    createdAt?: Date
  
    dob?: Date
  
    phone?: string
  
    imageUrl?: string
  
    updatedAt?: Date
  
    lock?: USER_LOCK;
  
    authStatus?: USER_SIGNUP_STATUS_TYPE
  
    userType?: USER_TYPE
  
    version?: API_VERSIONS
  }