import View from './view'
import Stylesheet from '../../stylesheets/main.css'

export default class Main extends View {
    public render(): Element[] {
        const sheet = new CSSStyleSheet()
        sheet.replace(Stylesheet)
        this.shadow.adoptedStyleSheets = [
            sheet,
        ]
        return [
            <div class="content">
                <slot></slot>
            </div>,
            <div class="bacground"></div>
        ]
    }
}