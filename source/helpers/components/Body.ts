import Stackable from './Stackable'

export default class Body extends Stackable {
    private _render: (this: Body) => void

    public constructor(render: (this: Body) => void = () => { }) {
        super()
        this._render = render
    }

    public get tag(): string {
        return 'body'
    }

    public render(parent: HTMLElement): void {
        this.dom = parent.ownerDocument.body
        this._render.call(this)
    }
}