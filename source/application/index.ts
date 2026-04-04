import Main from './views/main'

window.customElements.define('view-main', Main)

window.document.body.insertAdjacentHTML(
    'beforeend',
    '<view-main></view-main>'
)