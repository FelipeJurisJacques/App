import Stylizable from './Stylizable'

export default class Object extends Stylizable {
    private _render: (this: Object) => void

    public constructor(render: (this: Object) => void = () => { }) {
        super()
        this._render = render
    }

    public get data(): string {
        return this.dom?.getAttribute('data') ?? ''
    }

    public set data(value: string) {
        this.dom?.setAttribute('data', value)
    }

    public render(parent: HTMLElement | SVGElement): void {
        this.dom = parent.ownerDocument.createElement('object')
        this._render.call(this)
        parent.append(this.dom)
    }

    public get tag(): string {
        return 'object'
    }
}