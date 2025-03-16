import Element, { IElement } from "./Element"

interface IObject extends IElement {
    data?: string
    children?: Element[]
    onRender?: Function
}

export default class Object extends Element {

    constructor(Element: IObject = {}) {
        super(Element)
        if (Element.data) {
            this.attributes.set('data', Element.data)
        }
        if (Element.children) {
            this.children = Element.children
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