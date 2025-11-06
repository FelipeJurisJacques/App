export type ValueOf<T> = T[keyof T]
export type UrlEnum = Record<string, URL>
export type UrlEnumValue<T extends Record<string, URL>> = ValueOf<T>