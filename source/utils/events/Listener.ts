import Dispatcher from './dispatcher'
import Type from '../../enumeratos/events/type'

export default class Listener {
    private type: Type
    private queryes: Array<string | HTMLElement>
    private event: (event: Dispatcher) => void
    private static listeners: Array<Listener> = []
    private static documents: Array<Document> = []

    public static notify(event: Event): void {
        for (let listener of Listener.listeners) {
            listener.handler(event)
        }
    }

    public constructor(type: Type, query: HTMLElement | string | Array<string | HTMLElement>, event: (event: Dispatcher) => void) {
        this.type = type
        this.event = event
        this.queryes = Array.isArray(query) ? query : [
            query,
        ]
        for (let query of this.queryes) {
            if (
                query instanceof HTMLElement
                && query.ownerDocument
                && !Listener.documents.includes(query.ownerDocument)
            ) {
                Listener.documents.push(query.ownerDocument)
                query.ownerDocument.addEventListener('click', Listener.notify)
            }
        }
        if (Listener.documents.length === 0) {
            Listener.documents.push(window.document)
            window.document.addEventListener('click', Listener.notify)
        }
        Listener.listeners.push(this)
    }

    public handler(event: Event): void {
        if (this.is_type(event) && this.is_query(event)) {
            this.event(new Dispatcher(event, this.type, this.target(event)))
        }
    }

    private is_type(event: Event): boolean {
        switch (this.type) {
            case Type.ACTION:
                return event.type === 'click'
            default:
                return false
        }
    }

    private is_query(event: Event): boolean {
        if (event.target && event.target instanceof HTMLElement && event.target.ownerDocument) {
            for (let query of this.queryes) {
                if (typeof query === 'string') {
                    if (event.target.closest(query)) {
                        return true
                    }
                } else if (query.ownerDocument && query.ownerDocument === event.target.ownerDocument) {
                    if (query === event.target || query.contains(event.target)) {
                        return true
                    }
                }
            }
        }
        return false
    }

    private target(event: Event): HTMLElement {
        if (event.target && event.target instanceof HTMLElement && event.target.ownerDocument) {
            for (let query of this.queryes) {
                if (typeof query === 'string') {
                    let target = event.target.closest(query)
                    if (target) {
                        return target as HTMLElement
                    }
                } else if (query.ownerDocument && query.ownerDocument === event.target.ownerDocument) {
                    if (query === event.target || query.contains(event.target)) {
                        return query
                    }
                }
            }
        }
        return event.target as HTMLElement
    }
}