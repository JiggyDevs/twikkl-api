import { ClientSession, FilterQuery, UpdateQuery } from 'mongoose'

export abstract class IGenericRepository<T> {
    
    abstract find(fields: FilterQuery<T>, options?: { select?: string, isLean?: boolean })

    abstract findAllWithPagination(options: { query?: Record<string, any>, fields?: FilterQuery<T>, populate?: string | string[] })

    abstract findOne(key: FilterQuery<T>, session?: ClientSession, options?: { select?: string | string[], populate?: string | string[] })

    abstract create(payload: T | T[], session?: ClientSession)

    abstract update(key: FilterQuery<T>, payload: UpdateQuery<T>, session?: ClientSession)

    abstract delete(key: FilterQuery<T>, session?: ClientSession)

    abstract search(options: Record<string, any>, populate: string | string[])
}