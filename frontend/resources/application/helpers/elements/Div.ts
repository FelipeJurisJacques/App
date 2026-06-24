import Stackable from './Stackable'

export default class Div extends Stackable {
    private _render: (this: Div) => void

    public constructor(render: (this: Div) => void = () => { }) {
        super()
        this._render = render
    }

    public get tag(): string {
        return 'div'
    }

    public render(parent: HTMLElement | SVGElement): void {
        this.dom = parent.ownerDocument.createElement('div')
        this._render.call(this)
        parent.append(this.dom)
    }
}