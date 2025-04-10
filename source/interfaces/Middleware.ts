interface Middleware<T> {
    handle(context: T, next: () => void): void
}