import View from '../abstracts/view'
import Theread from '../helpers/Theread'

export default class Main extends View {
    private loop: null | number

    public constructor() {
        super()
        this.loop = null
    }

    protected async build(): Promise<string> {
        let icon = ''
        switch (window.localStorage.getItem('theme') ?? 'dark') {
            case 'light':
                icon = '<icon-light></icon-light>'
                this.ownerDocument.body.setAttribute('theme', 'light')
                break
            case 'high_contrast':
                icon = '<icon-high-contrast></icon-high-contrast>'
                this.ownerDocument.body.setAttribute('theme', 'high_contrast')
                break
            default:
                icon = '<icon-dark></icon-dark>'
                this.ownerDocument.body.setAttribute('theme', 'dark')
                break
        }
        return `
            <widget-top></widget-top>
            <widget-bar>
                <widget-button class="theme">
                    ${icon}
                </widget-button>
                <widget-button class="calendar" type="link" action="/calendar">
                    <icon-calendar>
                </widget-button>
            </widget-bar>
        `
    }

    protected handler(): void {
        const top = this.shadow.querySelector('widget-top')
        if (top) {
            this.loop = Theread.loop(60000, () => {
                const date = new Date()
                top.innerHTML = `
                    ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
                    <br>
                    ${date.toLocaleDateString()}
                `
            })
        }
        const theme = this.shadow.querySelector('widget-button.theme')
        if (theme) {
            this.listen('widget-button.theme').onAction(() => {
                switch (window.localStorage.getItem('theme') ?? 'dark') {
                    case 'light':
                        theme.innerHTML = '<icon-high-contrast />'
                        window.localStorage.setItem('theme', 'high_contrast')
                        this.ownerDocument.body.setAttribute('theme', 'high_contrast')
                        break
                    case 'high_contrast':
                        theme.innerHTML = '<icon-dark />'
                        window.localStorage.setItem('theme', 'dark')
                        this.ownerDocument.body.setAttribute('theme', 'dark')
                        break
                    default:
                        theme.innerHTML = '<icon-light />'
                        window.localStorage.setItem('theme', 'light')
                        this.ownerDocument.body.setAttribute('theme', 'light')
                        break
                }
            })
        }
    }

    public destroy(): void {
        if (this.loop) {
            Theread.stop(this.loop)
            this.loop = null
        }
    }
}