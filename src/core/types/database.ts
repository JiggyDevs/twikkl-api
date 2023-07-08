export type OptionalQuery<T> = {
    [K in keyof T]?: T[K]
  }

export type PaginationType = {
  perpage: string
  page: string
  sort: string
  q: string;
}

export type DateType = {
  to: string
  from: string
}