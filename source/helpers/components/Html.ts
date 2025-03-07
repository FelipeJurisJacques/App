import Component from "./Component"

export default class Html implements Component {
    private dom: Document
    private children: Component[]

    constructor({ children }: { children: Component[] }) {
        this.children = children
        this.dom = window.document
    }
}