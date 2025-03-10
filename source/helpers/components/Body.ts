import Component from "./Component"

export default class Body extends Component {

    constructor({ children }: { children?: Component[] }) {
        super()
        this.children = children ? children : []
    }

    public get tag(): string {
        return 'body'
    }

    public build(parent: HTMLElement): void {
        this.dom = parent.ownerDocument.body
        if (this.children) {
            for (const child of this.children) {
                child.build(this.dom)
            }
        }
    }
}