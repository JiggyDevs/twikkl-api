import { REDIS_CLIENT_NAME, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "src/config";


export default {
  retry_strategy: function (options: any) {
    // End reconnecting on a specific error and flush all commands with
    // a individual error
    if (options.error && options.error.code === 'ECONNREFUSED') return new Error('The server refused the connection');
    // End reconnecting after a specific timeout and flush all commands
    // with a individual error
    if (options.total_retry_time > 1000 * 60 * 60) return new Error('Retry time exhausted');
    // End reconnecting with built in error
    if (options.attempt > 10) return undefined;
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
  name: String(REDIS_CLIENT_NAME),
  port: Number(REDIS_PORT),
  host: String(REDIS_HOST),
  auth_pass: String(REDIS_PASSWORD),
  password: String(REDIS_PASSWORD),
  // ioredis setup
  reconnectOnError(err: any) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Only reconnect when the error contains "READONLY"
      return true; // or `return 1;`
    }
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false
}