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
            <div class="top">
                <div class="content">
                    00:00:00
                </div>
                <div class="bacground"></div>
            </div>
        ]
    }
}

window.customElements.define('view-main', Main)