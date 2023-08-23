export enum USER_LOCK {
  LOCK = 'lock',
  UNLOCK = 'unlock',
}

export const USER_LOCK_LIST = [USER_LOCK.LOCK, USER_LOCK.UNLOCK];

export enum USER_TYPE {
  CLIENT = 'client',
}

export const USER_TYPE_LIST = [USER_TYPE.CLIENT];

export enum USER_SIGNUP_STATUS_TYPE {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

export const USER_SIGNUP_STATUS_TYPE_LIST = [
  USER_SIGNUP_STATUS_TYPE.COMPLETED,
  USER_SIGNUP_STATUS_TYPE.PENDING,
  USER_SIGNUP_STATUS_TYPE.FAILED,
];

export enum API_VERSIONS {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
  V4 = 'v4',
  V5 = 'v5',
}

export const API_VERSION_LIST = [
  API_VERSIONS.V1,
  API_VERSIONS.V2,
  API_VERSIONS.V3,
  API_VERSIONS.V4,
  API_VERSIONS.V5,
];

export type JWT_USER_PAYLOAD_TYPE = {
  _id?: string;
  username: string;
  email: string;
  emailVerified: boolean;
};

export const JWT_EXPIRY_TIME: number = 5;
export const SIGNUP_CODE_EXPIRY: number = 600;
export const INCOMPLETE_AUTH_TOKEN_VALID_TIME: number = 1;

export enum VERIFICATION_VALUE_TYPE {
  TRUE = 'true',
  FALSE = 'false',
}

export const VERIFICATION_VALUE_TYPE_LIST = [
  VERIFICATION_VALUE_TYPE.TRUE,
  VERIFICATION_VALUE_TYPE.FALSE,
];

export enum DEVICE_TYPE {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export const DEVICES = [DEVICE_TYPE.IOS, DEVICE_TYPE.ANDROID, DEVICE_TYPE.WEB];

export const PLATFORM_NAME = 'twikkL';
export const GITHUB_LINK = 'https://github.com/JiggyDevs/twikkl-api.git';

export enum RedisPrefix {
  signupEmailCode = 'twikkL/signUpEmailCode',
  signupPhoneCode = 'twikkL/signUpPhoneCode',
  passwordResetCount = 'twikkL/passwordResetCount',
  resetCode = 'twikkL/resetCode',
  resetpassword = 'twikkL/resetPassword',
  changeEmailResetCount = 'twikkL/changeEmailResetCount',
  emailResetCode = 'twikkL/emailResetCode',
}

export const RESET_PASSWORD_EXPIRY = 600;
