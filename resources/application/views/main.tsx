import View from './view'
import Stylesheet from '../../stylesheets/main.css'
import MainBackground from '../../stylesheets/main-background.css'

export default class Main extends View {
    public render(): Element[] {
        const sheet = new CSSStyleSheet()
        sheet.replace(Stylesheet)
        sheet.replace(MainBackground)
        const background = new CSSStyleSheet()
        background.replace(MainBackground)
        this.shadow.adoptedStyleSheets = [
            sheet,
            background,
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