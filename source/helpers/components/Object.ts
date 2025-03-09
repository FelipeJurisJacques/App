import Component from "./Component"

export default class Object extends Component {
    private children: Component[]

    constructor({ children }: { children?: Component[] }) {
        super()
        this.children = children ? children : []
    }

    public build(parent: HTMLElement): void {
        this.dom = parent.ownerDocument.createElement('object')
        parent.append(this.dom)
        for (const child of this.children) {
            child.build(this.dom)
        }
    }
}