/**
 * Domain Specific Language (DLS) de HyperText Markup Language (HTML)
 */
const HyperTextMarkupLanguage = {
    create(tag, props, ...children) {
        const element = window.document.createElement(tag);
        if (props) {
            for (const key in props) {
                element.setAttribute(key, props[key]);
            }
        }
        if (children) {
            for (const child of children) {
                if (typeof child === 'string') {
                    element.insertAdjacentText('beforeend', child);
                }
                else {
                    element.appendChild(child);
                }
            }
        }
        return element;
    }
};

class View extends HTMLElement {
    shadow;
    constructor(opened = false) {
        super();
        this.shadow = this.attachShadow({
            mode: opened ? 'open' : 'closed',
        });
    }
    adoptedCallback() { }
    connectedCallback() {
        this.shadow.append(...this.render());
    }
    disconnectedCallback() {
        this.shadow.innerHTML = '';
    }
    connectedMoveCallback() { }
    attributeChangedCallback(name, old, value) {
        window.console.log(name, old, value);
    }
}

var Stylesheet = "div.content {\r\n    left: 50%;\r\n    top: 15px;\r\n    position: fixed;\r\n    font-size: 10pt;\r\n    text-align: center;\r\n    transform: translate(-50%, -50%);\r\n}\r\n\r\n* {\r\n    z-index: 0;\r\n}\r\n\r\n::slotted(*) {\r\n    z-index: 1;\r\n}\r\n\r\ndiv.bacground {\r\n    top: 0px;\r\n    left: 0px;\r\n    width: 100%;\r\n    height: 50px;\r\n    position: fixed;\r\n    overflow: hidden;\r\n    background-color: #071F1F;\r\n}\r\n\r\n:host-context(body[theme=\"dark\"]) div.bacground {\r\n    background-color: #071F1F;\r\n}\r\n\r\n:host-context(body[theme=\"dark\"]) div.bacground::before {\r\n    inset: 0;\r\n    content: '';\r\n    position: absolute;\r\n    pointer-events: none;\r\n    background:\r\n        repeating-linear-gradient(0deg,\r\n            #062627 0px,\r\n            #062627 1px,\r\n            transparent 1px,\r\n            transparent 3px);\r\n}";

class Main extends View {
    render() {
        const sheet = new CSSStyleSheet();
        sheet.replace(Stylesheet);
        this.shadow.adoptedStyleSheets = [
            sheet,
        ];
        return [
            HyperTextMarkupLanguage.create("div", { class: "content" },
                HyperTextMarkupLanguage.create("slot", null)),
            HyperTextMarkupLanguage.create("div", { class: "bacground" })
        ];
    }
}

window.customElements.define('view-main', Main);
window.document.body.insertAdjacentHTML('beforeend', '<view-main></view-main>');
//# sourceMappingURL=application.mjs.map
