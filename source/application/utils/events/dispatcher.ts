import Type from '../../enumeratos/events/type'

export default class Dispatcher {
    private origin: Event
    private type_enum: Type
    private element: HTMLElement

    public constructor(event: Event, type: Type, target: HTMLElement) {
        this.type_enum = type
        this.origin = event
        this.element = target
    }

    public get type(): Type {
        return this.type_enum
    }

    public get target(): HTMLElement {
        return this.element
    }
}