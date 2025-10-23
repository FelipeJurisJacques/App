import RouteHelper from './helpers/route'

import MainView from './views/main'
import CalendarView from './views/calendar'

import BarWidget from './templates/widgets/bar'
import TopWidget from './templates/widgets/top'
import ViewWidget from './templates/widgets/view'
import ButtonWidget from './templates/widgets/button'

import DarkIcon from './templates/icons/dark'
import LightIcon from './templates/icons/light'
import CalendarIcon from './templates/icons/calendar'
import HighContrastIcon from './templates/icons/high_contrast'

window.customElements.define('widget-bar', BarWidget)
window.customElements.define('widget-top', TopWidget)
window.customElements.define('widget-view', ViewWidget)
window.customElements.define('widget-button', ButtonWidget)

window.customElements.define('icon-dark', DarkIcon)
window.customElements.define('icon-light', LightIcon)
window.customElements.define('icon-calendar', CalendarIcon)
window.customElements.define('icon-high-contrast', HighContrastIcon)

window.customElements.define('view-main', MainView)
window.customElements.define('view-calendar', CalendarView)

RouteHelper.push('/', document => {
    return document.createElement('view-main')
})
RouteHelper.push('/index.html', document => {
    return document.createElement('view-main')
})
RouteHelper.push('/calendar', document => {
    return document.createElement('view-calendar')
})