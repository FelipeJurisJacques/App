import Element, { IElement } from "./Element"

interface IDiv extends IElement {
    children?: Element[]
    onRender?: Function
}

export default class Div extends Element {

    constructor(element: IDiv = {}) {
        super(element)
        if (element.children) {
            this.children = element.children
        }
    }

    public get tag(): string {
        return 'div'
    }
}