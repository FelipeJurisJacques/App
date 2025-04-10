import HandlerInterface from '../interfaces/Middleware'

export default class Middleware<T> {
    private index: number
    private middlewares: HandlerInterface<T>[]

    public constructor() {
        this.index = 0
        this.middlewares = []
    }

    public push(...mw: HandlerInterface<T>[]): void {
        this.middlewares.push(...mw)
    }

    public dispatch(context: T): void {
        if (this.middlewares.length) {
            const next = () => {
                if (this.index >= this.middlewares.length) {
                    this.index = 0
                } else {
                    const mw = this.middlewares[this.index++]
                    try {
                        mw.handle(context, next)
                    } catch (error) {
                        this.index = 0
                        throw error
                    }
                }
            }
            next()
        }
    }
}