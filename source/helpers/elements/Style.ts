<<<<<<< HEAD:source/helpers/components/Style.ts
import Component from './Component'

export default class Style extends Component {
    private _render: (this: Style) => void
=======
import Element from "./Element";
import StyleSheetSelector from "../styles/StyleSheetSelector";

export default class Style extends Element {
    private _styles: StyleSheetSelector[]
>>>>>>> 12411245bab8266f5246baa802936f03143f0316:source/helpers/elements/Style.ts

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