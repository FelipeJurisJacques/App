import Component from './Component'

export default class Style extends Component {
    private _render: (this: Style) => void

    public constructor(render: (this: Style) => void) {
        super()
        this._render = render
    }

    public get tag(): string {
        return 'style'
    }

    public render(parent: HTMLElement | SVGElement): void {
        this.dom = parent.ownerDocument.createElement(this.tag)
        parent.appendChild(this.dom)
        this._render.call(this)
    }
}