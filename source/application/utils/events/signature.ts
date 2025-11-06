import Target from './target'
import Listener from './listener'
import Dispatcher from './dispatcher'
import Type from '../../enumeratos/events/type'

export default class Signature {
    private readonly targetable: Target

    public constructor(target: Target) { this.targetable = target }

    public get target(): Target { return this.targetable }

    public onAction(event: (event: Dispatcher) => void): Listener {
        const listener = new Listener(this, Type.ACTION, event)
        Listener.push(this.targetable.view, listener)
        return listener
    }

    public handler(event: Event, type: Type, dispatcher: (event: Dispatcher) => void): void {
        this.targetable.handler(event, type, dispatcher)
    }
}