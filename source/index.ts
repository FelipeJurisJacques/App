import Theread from './helpers/Theread'
import Bar from './templates/widgets/bar'
import Top from './templates/widgets/top'
import Dark from './templates/icons/dark'
import View from './templates/widgets/view'
import Light from './templates/icons/light'
import Button from './templates/widgets/button'
import Calendar from './templates/icons/calendar'
import HighContrast from './templates/icons/high_contrast'

window.customElements.define('widget-bar', Bar)
window.customElements.define('widget-top', Top)
window.customElements.define('widget-view', View)
window.customElements.define('widget-button', Button)

window.customElements.define('icon-dark', Dark)
window.customElements.define('icon-light', Light)
window.customElements.define('icon-calendar', Calendar)
window.customElements.define('icon-high-contrast', HighContrast)

const style = window.document.querySelector('style.theme')
const container = window.document.querySelector('widget-view')

if (style && container && container instanceof View) {
    container.innerHTML = `
        <widget-top></widget-top>
        <widget-bar>
            <widget-button class="theme"></widget-button>
            <widget-button class="calendar">
                <icon-calendar>
            </widget-button>
        </widget-bar>
    `
    const theme = window.document.querySelector('widget-button.theme')
    if (theme) {
        switch (window.localStorage.getItem('theme') ?? 'dark') {
            case 'light':
                theme.innerHTML = '<icon-light />'
                window.document.body.setAttribute('theme', 'light')
                break
            case 'high_contrast':
                theme.innerHTML = '<icon-high-contrast />'
                window.document.body.setAttribute('theme', 'high_contrast')
                break
            default:
                theme.innerHTML = '<icon-dark />'
                window.document.body.setAttribute('theme', 'dark')
                break
        }
        container.listen('widget-button.theme').onAction(() => {
            switch (window.localStorage.getItem('theme') ?? 'dark') {
                case 'light':
                    theme.innerHTML = '<icon-high-contrast />'
                    window.localStorage.setItem('theme', 'high_contrast')
                    window.document.body.setAttribute('theme', 'high_contrast')
                    break
                case 'high_contrast':
                    theme.innerHTML = '<icon-dark />'
                    window.localStorage.setItem('theme', 'dark')
                    window.document.body.setAttribute('theme', 'dark')
                    break
                default:
                    theme.innerHTML = '<icon-light />'
                    window.localStorage.setItem('theme', 'light')
                    window.document.body.setAttribute('theme', 'light')
                    break
            }
        })
    }
    const top = window.document.querySelector('widget-top')
    if (top) {
        Theread.loop(60000, () => {
            const date = new Date()
            top.innerHTML = `
                ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}
                <br>
                ${date.toLocaleDateString()}
            `
        })
    }
}

// window.document.body.insertAdjacentHTML(
//     'beforeend',
//     '<script type="module" src="dist/application.mjs" async></script>'
// )