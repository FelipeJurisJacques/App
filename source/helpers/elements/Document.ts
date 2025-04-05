<<<<<<< HEAD:source/helpers/components/Document.ts
import Component from './Component'

export default class Document {
    protected dom?: HTMLElement
    private _render: (this: Document) => void

    constructor(render: (this: Document) => void) {
        this._render = render
=======
import Element from "./Element"

export default class Document {
    protected dom?: HTMLElement
    private children: Element[]

    constructor({ children }: { children: Element[] }) {
        this.children = children
>>>>>>> 12411245bab8266f5246baa802936f03143f0316:source/helpers/elements/Document.ts
    }

    public get tag(): string {
        return 'html'
    }

    public set children(children: Component[]) {
        if (this.dom) {
            for (let child of children) {
                child.render(this.dom)
            }
        }
    }

    render(window: Window): void {
        this.dom = window.document.documentElement
        this._render.call(this)
    }
}