import Component, { IComponent } from "./Component";

interface ICanvas extends IComponent {
    width: number
    height: number
}

export default class Canvas extends Component {

    public constructor(component: ICanvas) {
        super(component)
        this.attributes.set('width', component.width.toString())
        this.attributes.set('height', component.height.toString())
    }

    public get tag(): string {
        return 'canvas'
    }
}