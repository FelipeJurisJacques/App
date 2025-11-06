import View from '../abstracts/view'
import Template from '../helpers/Template'
import DateTime from '../utils/datetime/DateTime'
import Stylesheet from '../enumeratos/assets/stylesheet'

export default class Calendar extends View {
    protected async build(): Promise<string> {
        this.className = 'window'
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
        console.log(DateTime.getWeeks())
        const day = new Date()
        const start = new Date(day.getFullYear(), day.getMonth(), 1)
        const end = new Date(day.getFullYear(), day.getMonth() + 1, 0)
        return `
            ${await Template.stylesheet(Stylesheet.VIEW_CALENDAR)}
            <table>
                <thead>
                    <th>Domingo</th>
                    <th>Segunda-feira</th>
                    <th>Terça-feira</th>
                    <th>Quarta-feira</th>
                    <th>Quinta-feira</th>
                    <th>Sexta-feira</th>
                    <th>Sábado</th>
                </thead>
                <tbody>
                </tbody>
            </table>
            <widget-bar>
                <widget-button class="theme">
                    ${icon}
                </widget-button>
                <widget-button class="calendar" type="link" action="/calendar">
                    <icon-calendar>
                </widget-button>
                <widget-button class="home" type="link" action="/">
                    <icon-calendar>
                </widget-button>
            </widget-bar>
        `
    }
}