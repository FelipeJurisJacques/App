import Component from "./Component"

export default class Body implements Component {
    private dom: HTMLElement
    private children: Component[]

    constructor({ children }: { children?: Component[] }) {
        this.children = children ? children : []
        this.dom = window.document.body
    }
}