import Element, { IElement } from "./Element";

interface ICanvas extends IElement {
    width: number
    height: number
}

export default class Canvas extends Element {

    public constructor(Element: ICanvas) {
        super(Element)
        this.attributes.set('width', Element.width.toString())
        this.attributes.set('height', Element.height.toString())
    }

    public get tag(): string {
        return 'canvas'
    }
}