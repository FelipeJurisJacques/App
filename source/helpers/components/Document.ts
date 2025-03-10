import Component from "./Component"

export default class Document {
    protected dom?: HTMLElement
    private children: Component[]

    constructor({ children }: { children: Component[] }) {
        this.children = children
    }

    public get tag(): string {
        return 'html'
    }

    render(window: Window): void {
        this.dom = window.document.documentElement
        for (const child of this.children) {
            child.render(this.dom)
        }
    }
}