import Component from "./Component";
import StyleSheetSelector from "../styles/StyleSheetSelector";

export default class Style extends Component {
    private _styles: StyleSheetSelector[]

    public constructor({children}: {children?: StyleSheetSelector[]}) {
        super()
        this._styles = children ? children : []
    }

    public render(parent: HTMLElement | SVGElement): void {
        super.render(parent)
        if (this.dom) {
            let styles = ''
            for (const style of this._styles) {
                styles += style.toString()
            }
            this.dom.innerHTML = styles
        }
    }

    public get tag(): string {
        return 'style'
    }
}