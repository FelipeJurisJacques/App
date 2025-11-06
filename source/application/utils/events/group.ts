import Listener from './listener'
import View from '../../abstracts/view'

export default class Group {
    private origin: View
    private listeners: Listener[]

    public constructor(view: View, listener: Listener) {
        this.listeners = [
            listener,
        ]
        this.origin = view
        view.shadowRoot!.addEventListener('click', event => {
            for (let listener of this.listeners) {
                listener.handler(event)
            }
        })
    }

    public push(listener: Listener): void {
        this.listeners.push(listener)
    }

    public get view(): View { return this.origin }
}