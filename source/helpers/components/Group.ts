import Component, { IComponent } from "./Component"

interface IGroup extends IComponent {
    children: Component[]
    clipPath?: string
}

export default class Group extends Component {

    public constructor(component: IGroup) {
        super(component)
        this.children = component.children
        if (component.clipPath) {
            this.attributes.set('clip-path', component.clipPath)
        }
    }

    public get tag(): string {
        return 'g'
    }
}