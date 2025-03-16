import Element, { IElement } from "./Element";

interface IPolygon extends IElement {
    color?: string
    points: string
    clipPath?: string
}

export default class Polygon extends Element {

    constructor(Element: IPolygon) {
        super(Element)
        this.attributes.set('points', Element.points)
        if (Element.color) {
            this.attributes.set('fill', Element.color)
        }
        if (Element.clipPath) {
            this.attributes.set('clip-path', Element.clipPath)
        }
    }

    public get tag(): string {
        return 'polygon'
    }
}