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
        this.shadow.append(this.render());
    }
    disconnectedCallback() {
        this.shadow.innerHTML = '';
    }
    connectedMoveCallback() { }
    attributeChangedCallback(name, old, value) {
        window.console.log(name, old, value);
    }
}

class Main extends View {
    render() {
        return (HyperTextMarkupLanguage.create("div", null,
            HyperTextMarkupLanguage.create("h1", null, "Main")));
    }
}

window.customElements.define('view-main', Main);
window.document.body.insertAdjacentHTML('beforeend', '<view-main></view-main>');
//# sourceMappingURL=application.mjs.map
