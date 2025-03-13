import Component from "./Component"

export default class Body extends Component {

    constructor({ children }: { children?: Component[] }) {
        super()
        if (children) {
            this.children = children
        }
    }

    public get tag(): string {
        return 'body'
    }
}