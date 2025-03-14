import Component, { IComponent } from "./Component"

interface IObject extends IComponent {
    data?: string
    children?: Component[]
    onRender?: Function
}

export default class Object extends Component {

    constructor(component: IObject = {}) {
        super(component)
        if (component.data) {
            this.attributes.set('data', component.data)
        }
        if (component.children) {
            this.children = component.children
        }
    }

    public get data(): string|null {
        const value = this.attributes.get('data')
        return value ? value : null
    }

    public set data(value: string) {
        this.attributes.set('data', value)
    }

    public get tag(): string {
        return 'object'
    }
}