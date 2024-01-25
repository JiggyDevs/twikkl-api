require('dotenv').config();

function getEnv(variable: string, optional: boolean = false) {
  if (process.env[variable] === undefined) {
    if (optional) {
      console.warn(
        `[@env]: Environmental variable for ${variable} is not supplied. \n So a default value will be generated for you.`,
      );
    } else {
      throw new Error(
        `You must create an environment variable for ${variable}`,
      );
    }
  }

  return process.env[variable]?.replace(/\\n/gm, '\n');
}

//environments
export const env = {
  isDev: String(process.env.NODE_ENV).toLowerCase().includes('dev'),
  isTest: String(process.env.NODE_ENV).toLowerCase().includes('test'),
  isProd: String(process.env.NODE_ENV).toLowerCase().includes('prod'),
  isStaging: String(process.env.NODE_ENV).toLowerCase().includes('staging'),
  env: process.env.NODE_ENV,
};

export const PORT = getEnv('PORT')!;
export const MONGO_DB_URL = getEnv('MONGO_DB_URL')!;
export const JWT_SECRET_KEY = getEnv('JWT_SECRET_KEY')!;
export const ADMIN_CYPHER_SECRET = getEnv('ADMIN_CYPHER_SECRET');
export const REDIS_CLIENT_NAME = getEnv('REDIS_CLIENT_NAME');
export const REDIS_HOST = getEnv('REDIS_HOST');
export const REDIS_PASSWORD = getEnv('REDIS_PASSWORD');
export const REDIS_PORT = getEnv('REDIS_PORT');
export const STORAGE_URL = getEnv('STORAGE_URL', true)!;
export const STORAGE_KEY = getEnv('STORAGE_KEY', true)!;
export const FIREBASE_CONFIG = getEnv('FIREBASE_CONFIG', true);
export const DISCORD_VERIFICATION_CHANNEL_LINK = getEnv(
  'DISCORD_VERIFICATION_CHANNEL_LINK',
  true,
);
export const ADMIN_FRONTEND_URL = getEnv('ADMIN_FRONTEND_URL', true);
export const PRIVATE_KEY = getEnv('PRIVATE_KEY', true);
