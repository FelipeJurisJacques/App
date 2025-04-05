import Element from "./Element"

<<<<<<< HEAD:source/helpers/components/Svg.ts
export default class Svg extends Component {
    private _render: (this: Svg) => void

    public constructor(render: (this: Svg) => void) {
=======
export default class Svg extends Element {

    constructor({ width, height, viewBox, children }: { width?: number | string, height?: number | string, viewBox?: string, children?: Element[] }) {
>>>>>>> 12411245bab8266f5246baa802936f03143f0316:source/helpers/elements/Svg.ts
        super()
        this._render = render
    }

    public get width(): number {
        return parseFloat(this.dom?.getAttribute('width') ?? '0')
    }

    public get height(): number {
        return parseFloat(this.dom?.getAttribute('height') ?? '0')
    }

    public get viewBox(): string {
        return this.dom?.getAttribute('viewBox') ?? ''
    }

    public set width(value: number) {
        this.dom?.setAttribute('width', value.toString())
    }

    public set height(value: number) {
        this.dom?.setAttribute('height', value.toString())
    }

    public set viewBox(value: string) {
        this.dom?.setAttribute('viewBox', value)
    }

    public get tag(): string {
        return 'svg'
    }

    public render(parent: HTMLElement): void {
        this.dom = parent.ownerDocument.createElementNS('http://www.w3.org/2000/svg', this.tag)
        parent.appendChild(this.dom)
        this._render.call(this)
    }
}