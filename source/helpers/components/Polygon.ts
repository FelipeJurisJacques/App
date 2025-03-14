import Component, { IComponent } from "./Component";

interface IPolygon extends IComponent {
    color?: string
    points: string
    clipPath?: string
}

export default class Polygon extends Component {

    constructor(component: IPolygon) {
        super(component)
        this.attributes.set('points', component.points)
        if (component.color) {
            this.attributes.set('fill', component.color)
        }
        if (component.clipPath) {
            this.attributes.set('clip-path', component.clipPath)
        }
    }

    public get tag(): string {
        return 'polygon'
    }
}