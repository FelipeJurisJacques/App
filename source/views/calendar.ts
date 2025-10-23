import View from '../abstracts/view'

export default class Calendar extends View {
    public constructor() {
        super()
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
        this.shadow.innerHTML = `
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

    public handler(): void {
        this.className = 'window'
    }
}