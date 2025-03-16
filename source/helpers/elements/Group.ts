import Element, { IElement } from "./Element"

interface IGroup extends IElement {
    children: Element[]
    clipPath?: string
}

export default class Group extends Element {

    public constructor(element: IGroup) {
        super(element)
        this.children = element.children
        if (element.clipPath) {
            this.attributes.set('clip-path', element.clipPath)
        }
    }

    public get tag(): string {
        return 'g'
    }
}