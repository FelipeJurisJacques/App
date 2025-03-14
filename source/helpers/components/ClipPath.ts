import Component, { IComponent } from "./Component"

interface IClipPath extends IComponent {
    id: string
    children?: Component[]
}

export default class ClipPath extends Component {

    constructor(component: IClipPath) {
        super()
        this.attributes.set('id', component.id)
        if (component.children) {
            this.children = component.children
        }
    }

    public get tag(): string {
        return 'clipPath'
    }
}