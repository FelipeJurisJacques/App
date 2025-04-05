import Component from './Component'

export default class Document {
    protected dom?: HTMLElement
    private _render: (this: Document) => void

    constructor(render: (this: Document) => void) {
        this._render = render
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