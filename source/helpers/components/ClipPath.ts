import Component from "./Component"

export default class ClipPath extends Component {

    constructor({ id, children }: { id: string, children?: Component[] }) {
        super()
        this.attributes.set('id', id)
        this.children = children ? children : []
    }

    public get tag(): string {
        return 'clipPath'
    }
}