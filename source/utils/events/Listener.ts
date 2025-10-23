import Group from './group'
import Signature from './signature'
import Dispatcher from './dispatcher'
import View from '../../abstracts/view'
import Type from '../../enumeratos/events/type'

export default class Listener {
    private static groups: Group[] = []

    private readonly type: Type
    private readonly signatured: Signature
    private readonly event: (event: Dispatcher) => void

    public static push(view: View, listener: Listener): void {
        console.info('LISTEN: ', listener)
        for (let group of Listener.groups) {
            if (view === group.view) {
                group.push(listener)
                return
            }
        }
        Listener.groups.push(new Group(view, listener))
    }

    public constructor(signature: Signature, type: Type, event: (event: Dispatcher) => void) {
        this.type = type
        this.event = event
        this.signatured = signature
    }

    public get signature(): Signature { return this.signatured }

    public handler(event: Event): void {
        if (this.isType(event)) {
            this.signatured.handler(event, this.type, this.event)
        }
    }

    private isType(event: Event): boolean {
        switch (this.type) {
            case Type.ACTION:
                return event.type === 'click'
            default:
                return false
        }
    }
}