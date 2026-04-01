import Main from './views/main'

window.customElements.define('view-main', Main)

window.document.body.insertAdjacentElement('beforeend', '<view-main></view-main>')