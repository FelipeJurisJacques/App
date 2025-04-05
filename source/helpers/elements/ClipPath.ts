import Element, { IElement } from "./Element"

interface IClipPath extends IElement {
    id: string
    children?: Element[]
}

export default class ClipPath extends Element {

    constructor(Element: IClipPath) {
        super()
        this.attributes.set('id', Element.id)
        if (Element.children) {
            this.children = Element.children
        }
    }

    public get tag(): string {
        return 'clipPath'
    }
}