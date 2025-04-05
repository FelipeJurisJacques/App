import Component from './Component'

export default class Canvas extends Component {
    private _render: (this: Canvas) => void

    public constructor(render: (this: Canvas) => void = () => { }) {
        super()
        this._render = render
    }

    public get width(): number {
        if (this.dom) {
            if (this.dom.hasAttribute('width')) {
                return parseInt(this.dom.getAttribute('width')!)
            }
        }
        return 0
    }

    public get height(): number {
        if (this.dom) {
            if (this.dom.hasAttribute('height')) {
                return parseInt(this.dom.getAttribute('height')!)
            }
        }
        return 0
    }

    public set width(value: number) {
        if (this.dom) {
            this.dom.setAttribute('width', value.toString())
        }
    }

    public set height(value: number) {
        if (this.dom) {
            this.dom.setAttribute('height', value.toString())
        }
    }

    public render(parent: HTMLElement | SVGElement): void {
        this.dom = parent.ownerDocument.createElement('canvas')
        this._render.call(this)
        parent.append(this.dom)
    }

    public get tag(): string {
        return 'canvas'
    }
}