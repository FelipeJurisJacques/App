import Component from './Component'

export default class Polygon extends Component {
    private _render: (this: Polygon) => void

    public constructor(render: (this: Polygon) => void) {
        super()
        this._render = render
    }

    public get tag(): string {
        return 'polygon'
    }

    public render(parent: HTMLElement | SVGElement): void {
        this.dom = parent.ownerDocument.createElementNS('http://www.w3.org/2000/svg', this.tag)
        parent.appendChild(this.dom)
        this._render.call(this)
    }
}