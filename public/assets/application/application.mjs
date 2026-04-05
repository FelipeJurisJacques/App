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

var MainBackground = "div.bacground {\n    clip-path: polygon(0px 0px, calc(50% - 71px) 0px, calc(50% - 72px) 0px, calc(50% - 62px) 30px, calc(50% - 61px) 30px, calc(50% - 71px) 0px, calc(50% + 71px) 0px, calc(50% + 72px) 0px, calc(50% + 62px) 30px, calc(50% + 61px) 30px, calc(50% + 71px) 0px, calc(50% - 81px) 0px, calc(50% - 82px) 0px, calc(50% - 72px) 30px, calc(50% - 71px) 30px, calc(50% - 81px) 0px, calc(50% + 81px) 0px, calc(50% + 82px) 0px, calc(50% + 72px) 30px, calc(50% + 71px) 30px, calc(50% + 81px) 0px, calc(50% - 92px) 0px, calc(50% - 94px) 0px, calc(50% - 84px) 30px, calc(50% - 82px) 30px, calc(50% - 92px) 0px, calc(50% + 92px) 0px, calc(50% + 94px) 0px, calc(50% + 84px) 30px, calc(50% + 82px) 30px, calc(50% + 92px) 0px, calc(50% - 102px) 0px, calc(50% - 104px) 0px, calc(50% - 94px) 30px, calc(50% - 92px) 30px, calc(50% - 102px) 0px, calc(50% + 102px) 0px, calc(50% + 104px) 0px, calc(50% + 94px) 30px, calc(50% + 92px) 30px, calc(50% + 102px) 0px, calc(50% - 112px) 0px, calc(50% - 114px) 0px, calc(50% - 104px) 30px, calc(50% - 102px) 30px, calc(50% - 112px) 0px, calc(50% + 112px) 0px, calc(50% + 114px) 0px, calc(50% + 104px) 30px, calc(50% + 102px) 30px, calc(50% + 112px) 0px, calc(50% - 123px) 0px, calc(50% - 126px) 0px, calc(50% - 116px) 30px, calc(50% - 113px) 30px, calc(50% - 123px) 0px, calc(50% + 123px) 0px, calc(50% + 126px) 0px, calc(50% + 116px) 30px, calc(50% + 113px) 30px, calc(50% + 123px) 0px, calc(50% - 133px) 0px, calc(50% - 136px) 0px, calc(50% - 126px) 30px, calc(50% - 123px) 30px, calc(50% - 133px) 0px, calc(50% + 133px) 0px, calc(50% + 136px) 0px, calc(50% + 126px) 30px, calc(50% + 123px) 30px, calc(50% + 133px) 0px, calc(50% - 143px) 0px, calc(50% - 146px) 0px, calc(50% - 136px) 30px, calc(50% - 133px) 30px, calc(50% - 143px) 0px, calc(50% + 143px) 0px, calc(50% + 146px) 0px, calc(50% + 136px) 30px, calc(50% + 133px) 30px, calc(50% + 143px) 0px, calc(50% - 153px) 0px, calc(50% - 156px) 0px, calc(50% - 146px) 30px, calc(50% - 143px) 30px, calc(50% - 153px) 0px, calc(50% + 153px) 0px, calc(50% + 156px) 0px, calc(50% + 146px) 30px, calc(50% + 143px) 30px, calc(50% + 153px) 0px, calc(50% - 164px) 0px, calc(50% - 168px) 0px, calc(50% - 158px) 30px, calc(50% - 154px) 30px, calc(50% - 164px) 0px, calc(50% + 164px) 0px, calc(50% + 168px) 0px, calc(50% + 158px) 30px, calc(50% + 154px) 30px, calc(50% + 164px) 0px, calc(50% - 174px) 0px, calc(50% - 178px) 0px, calc(50% - 168px) 30px, calc(50% - 164px) 30px, calc(50% - 174px) 0px, calc(50% + 174px) 0px, calc(50% + 178px) 0px, calc(50% + 168px) 30px, calc(50% + 164px) 30px, calc(50% + 174px) 0px, calc(50% - 184px) 0px, calc(50% - 188px) 0px, calc(50% - 178px) 30px, calc(50% - 174px) 30px, calc(50% - 184px) 0px, calc(50% + 184px) 0px, calc(50% + 188px) 0px, calc(50% + 178px) 30px, calc(50% + 174px) 30px, calc(50% + 184px) 0px, calc(50% - 195px) 0px, calc(50% - 200px) 0px, calc(50% - 190px) 30px, calc(50% - 185px) 30px, calc(50% - 195px) 0px, calc(50% + 195px) 0px, calc(50% + 200px) 0px, calc(50% + 190px) 30px, calc(50% + 185px) 30px, calc(50% + 195px) 0px, calc(50% - 205px) 0px, calc(50% - 210px) 0px, calc(50% - 200px) 30px, calc(50% - 195px) 30px, calc(50% - 205px) 0px, calc(50% + 205px) 0px, calc(50% + 210px) 0px, calc(50% + 200px) 30px, calc(50% + 195px) 30px, calc(50% + 205px) 0px, calc(50% - 215px) 0px, calc(50% - 220px) 0px, calc(50% - 210px) 30px, calc(50% - 205px) 30px, calc(50% - 215px) 0px, calc(50% + 215px) 0px, calc(50% + 220px) 0px, calc(50% + 210px) 30px, calc(50% + 205px) 30px, calc(50% + 215px) 0px, calc(50% - 226px) 0px, calc(50% - 232px) 0px, calc(50% - 222px) 30px, calc(50% - 216px) 30px, calc(50% - 226px) 0px, calc(50% + 226px) 0px, calc(50% + 232px) 0px, calc(50% + 222px) 30px, calc(50% + 216px) 30px, calc(50% + 226px) 0px, calc(50% - 236px) 0px, calc(50% - 242px) 0px, calc(50% - 232px) 30px, calc(50% - 226px) 30px, calc(50% - 236px) 0px, calc(50% + 236px) 0px, calc(50% + 242px) 0px, calc(50% + 232px) 30px, calc(50% + 226px) 30px, calc(50% + 236px) 0px, calc(50% - 246px) 0px, calc(50% - 252px) 0px, calc(50% - 242px) 30px, calc(50% - 236px) 30px, calc(50% - 246px) 0px, calc(50% + 246px) 0px, calc(50% + 252px) 0px, calc(50% + 242px) 30px, calc(50% + 236px) 30px, calc(50% + 246px) 0px, calc(50% - 256px) 0px, calc(50% - 262px) 0px, calc(50% - 252px) 30px, calc(50% - 246px) 30px, calc(50% - 256px) 0px, calc(50% + 256px) 0px, calc(50% + 262px) 0px, calc(50% + 252px) 30px, calc(50% + 246px) 30px, calc(50% + 256px) 0px, calc(50% - 267px) 0px, calc(50% - 274px) 0px, calc(50% - 264px) 30px, calc(50% - 257px) 30px, calc(50% - 267px) 0px, calc(50% + 267px) 0px, calc(50% + 274px) 0px, calc(50% + 264px) 30px, calc(50% + 257px) 30px, calc(50% + 267px) 0px, 0px 0px);\n}";

class Main extends View {
    render() {
        const sheet = new CSSStyleSheet();
        sheet.replace(Stylesheet);
        sheet.replace(MainBackground);
        const background = new CSSStyleSheet();
        background.replace(MainBackground);
        this.shadow.adoptedStyleSheets = [
            sheet,
            background,
        ];
        return [
            HyperTextMarkupLanguage.create("div", { class: "top" },
                HyperTextMarkupLanguage.create("div", { class: "content" }, "00:00:00"),
                HyperTextMarkupLanguage.create("div", { class: "bacground" }))
        ];
    }
}

window.customElements.define('view-main', Main);
window.document.body.insertAdjacentHTML('beforeend', '<view-main></view-main>');
//# sourceMappingURL=application.mjs.map
