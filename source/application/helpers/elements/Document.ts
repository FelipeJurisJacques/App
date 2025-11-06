import Element from './Element'

export default class Document {
    protected dom?: HTMLElement
    private _render: (this: Document) => void

    public constructor(render: (this: Document) => void) {
        this._render = render
    }

    public get tag(): string {
        return 'html'
    }

    public set children(children: Element[]) {
        if (this.dom) {
            for (const child of children) {
                child.render(this.dom)
            }
        }
    }

    public render(window: Window): void {
        this.dom = window.document.documentElement
        this._render.call(this)
    }
}