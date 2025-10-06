import Util from '../../utils/events/Listener'
import Type from '../../enumeratos/events/type'
import Dispatcher from '../../utils/events/dispatcher'

export default class Listener {
    private readonly query: HTMLElement | string | Array<string | HTMLElement>

    public static listen(query: HTMLElement | string | Array<string | HTMLElement>) {
        return new Listener(query)
    }

    private constructor(query: HTMLElement | string | Array<string | HTMLElement>) {
        this.query = query
    }

    public onAction(event: (event: Dispatcher) => void): Util {
        return new Util(Type.ACTION, this.query, event)
    }
}