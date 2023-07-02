export abstract class IInMemoryServices {
    abstract set?(key: string, value: any, expiry: string | any[])
    abstract get(key: string)
    abstract del(key: string)
    abstract ttl(key: string)
  }