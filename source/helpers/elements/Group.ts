import Component from './Element'

export default class Group extends Component {
    private _render: (this: Group) => void

    public constructor(render: (this: Group) => void) {
        super()
        this._render = render
    }

    public get tag(): string {
        return 'g'
    }

    public render(parent: HTMLElement | SVGElement): void {
        this.dom = parent.ownerDocument.createElementNS('http://www.w3.org/2000/svg', this.tag)
        parent.appendChild(this.dom)
        this._render.call(this)
    }
}