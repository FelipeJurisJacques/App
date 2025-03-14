import Component, { IComponent } from "./Component"

interface IBody extends IComponent {
    children?: Component[]
}

export default class Body extends Component {

    constructor(component: IBody = {}) {
        super(component)
        if (component.children) {
            this.children = component.children
        }
    }

    public get tag(): string {
        return 'body'
    }
}