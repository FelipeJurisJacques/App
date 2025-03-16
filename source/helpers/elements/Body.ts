import Element, { IElement } from "./Element"

interface IBody extends IElement {
    children?: Element[]
}

export default class Body extends Element {

    constructor(Element: IBody = {}) {
        super(Element)
        if (Element.children) {
            this.children = Element.children
        }
    }

    public get tag(): string {
        return 'body'
    }
}