import Component from "./Component"

export default class Html {
    protected dom?: HTMLElement
    private children: Component[]

    constructor({ children }: { children: Component[] }) {
        this.children = children
    }
    
    build(window: Window): void {
        this.dom = window.document.documentElement
        for (const child of this.children) {
            child.build(this.dom)
        }
    }
}