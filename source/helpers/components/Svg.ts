import Component from "./Component"

export default class Svg extends Component {

    constructor({ children }: { children?: Component[] }) {
        super()
        this.children = children ? children : []
    }

    public get tag(): string {
        return 'svg'
    }
}