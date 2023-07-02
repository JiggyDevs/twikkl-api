import { Logger } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'src/config';
import { JWT_EXPIRY_TIME, JWT_USER_PAYLOAD_TYPE } from './constants';

const jwtLib = {
  jwtSign: async (payload: JWT_USER_PAYLOAD_TYPE & { exp?: string | number }, validity = `${JWT_EXPIRY_TIME}h`) => {
    const cPayload = payload;
    delete cPayload?.exp;
    try {
      return sign(cPayload, JWT_SECRET_KEY, {
        expiresIn: validity,
      });
    } catch (error) {
      Logger.error('@jwtSign', error)
    }
  },

  jwtVerify: async (token: string): Promise<JWT_USER_PAYLOAD_TYPE | null> => {
    let decoded: JWT_USER_PAYLOAD_TYPE | null = null;
    try {
      decoded = verify(token, JWT_SECRET_KEY) as JWT_USER_PAYLOAD_TYPE & { expiry: Date };
    } catch (error) {
      Logger.error('@jwtSign', error)
    } finally {
      return decoded;
    }
  },

  encrypt: async (payload: any, validity = '1h') => {
    try {
      return sign(payload, JWT_SECRET_KEY, {
        expiresIn: validity,
      });
    } catch (error) {
      Logger.error('@jwtSign', error)
    }
  },

  decrypt: async (token: string): Promise<any> => {
    try {
      return Promise.resolve(verify(token, JWT_SECRET_KEY));
    } catch (error) {
      Logger.error('@jwtSign', error)
    }
  },
  
  encryptDevice: async (payload: any, validity = '720h') => {
    try {
      return sign(payload, JWT_SECRET_KEY, {
        expiresIn: validity,
      });
    } catch (error) {
      Logger.error('@jwtSign', error)
    }
  },

  decryptDevice: async (token: string): Promise<any> => {
    try {
      return verify(token, JWT_SECRET_KEY);
    } catch (error) {
      Logger.error('@jwtSign', error)
    }
  },
};

export default jwtLib