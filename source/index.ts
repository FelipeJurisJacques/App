import Main from './views/main'
import Route from './helpers/route'
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

Route.push('/', Main)