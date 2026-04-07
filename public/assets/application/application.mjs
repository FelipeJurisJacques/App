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
                if (tag === 'style' && child instanceof HTMLElement) {
                    element.textContent += toCSS(child);
                }
                else if (typeof child === 'string') {
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
/**
 * Converte um elemento e seus filhos em uma string CSS (Nesting)
 */
function toCSS(element) {
    let selector = element.tagName.toLowerCase();
    if (element.id)
        selector += `#${element.id}`;
    if (element.className)
        selector += `.${element.className.split(/\s+/).filter(Boolean).join('.')}`;
    let css = `${selector} {\n`;
    for (const attr of Array.from(element.attributes)) {
        const { name, value } = attr;
        if (name !== 'id' && name !== 'class') {
            css += `    ${name}: ${value};\n`;
        }
    }
    for (const child of Array.from(element.childNodes)) {
        if (child instanceof HTMLElement) {
            css += toCSS(child).split('\n').map(line => `    ${line}`).join('\n') + '\n';
        }
        else if (child.nodeType === Node.TEXT_NODE) {
            css += `    ${child.textContent}\n`;
        }
    }
    css += '}\n';
    return css;
}

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
        this.handler();
    }
    disconnectedCallback() {
        this.shadow.innerHTML = '';
    }
    connectedMoveCallback() { }
    attributeChangedCallback(name, old, value) {
        window.console.log(name, old, value);
    }
}

var Stylesheet$1 = "* {\r\n    z-index: 0;\r\n}\r\n\r\n::slotted(*) {\r\n    z-index: 1;\r\n}\r\n\r\np.top {\r\n    top: 15px;\r\n    left: 50%;\r\n    position: fixed;\r\n    font-size: 10pt;\r\n    text-align: center;\r\n    transform: translate(-50%, -50%);\r\n}\r\n\r\ncustom-shape {\r\n    top: 0px;\r\n    left: 0px;\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n}\r\n\r\ndiv.bacground {\r\n    top: 0px;\r\n    left: 0px;\r\n    width: 100%;\r\n    height: 50px;\r\n    position: fixed;\r\n    overflow: hidden;\r\n    background-color: #071F1F;\r\n}\r\n\r\n:host-context(body[theme=\"dark\"]) div.bacground {\r\n    background-color: #071F1F;\r\n}\r\n\r\n:host-context(body[theme=\"dark\"]) div.bacground::before {\r\n    inset: 0;\r\n    content: '';\r\n    position: absolute;\r\n    pointer-events: none;\r\n    background:\r\n        repeating-linear-gradient(0deg,\r\n            #062627 0px,\r\n            #062627 1px,\r\n            transparent 1px,\r\n            transparent 3px);\r\n}";

class Main extends View {
    render() {
        const sheet = new CSSStyleSheet();
        sheet.replace(Stylesheet$1);
        this.shadow.adoptedStyleSheets = [
            sheet,
        ];
        return [
            HyperTextMarkupLanguage.create("custom-shape", null,
                HyperTextMarkupLanguage.create("p", { class: "top" }, "00:00:00"))
        ];
    }
    handler() {
        const shape = this.shadow.querySelector('custom-shape');
        if (shape) {
            // top
            shape.polygon(() => {
                const path = [];
                path.push([0, 0]);
                for (let i = 0; i < 20; i++) {
                    let size = Math.round(1 * (i * 0.3 + 1));
                    let center = shape.width / 2;
                    path.push([50 + center + (i * 10 + size + 70), 0]);
                    path.push([50 + center + (i * 10 + size + 70 + size), 0]);
                    path.push([50 + center + (i * 10 + size + 60 + size), 30]);
                    path.push([50 + center + (i * 10 + size + 60), 30]);
                    path.push([50 + center + (i * 10 + size + 70), 0]);
                    path.push([center - 50 - (i * 10 + size + 70), 0]);
                    path.push([center - 50 - (i * 10 + size + 70 + size), 0]);
                    path.push([center - 50 - (i * 10 + size + 60 + size), 30]);
                    path.push([center - 50 - (i * 10 + size + 60), 30]);
                    path.push([center - 50 - (i * 10 + size + 70), 0]);
                    path.push([50 + center + (i * 10 + size + 70), 0]);
                    path.push([center - 50 - (i * 10 + size + 70), 0]);
                    path.push([center - 50 - (i * 10 + size + 70 + size), 0]);
                    path.push([center - 50 - (i * 10 + size + 60 + size), 30]);
                    path.push([center - 50 - (i * 10 + size + 60), 30]);
                    path.push([center - 50 - (i * 10 + size + 70), 0]);
                    path.push([center - 50 - (i * 10 + size + 70), 0]);
                }
                path.push([0, 0]);
                return {
                    color: '#071F1F',
                    points: path,
                };
            });
            // bottom
            shape.polygon(() => {
                const top = shape.height - 50;
                const center = shape.width / 2.0;
                return {
                    color: '#071F1F',
                    points: [
                        [0, top],
                        [Math.max(center - 230, 10), top],
                        [Math.max(center - 220, 20), top - 10],
                        [center - 50, top - 10],
                        [center - 40, top],
                        [center + 40, top],
                        [center + 50, top - 10],
                        [Math.min(center + 220, shape.width - 20), top - 10],
                        [Math.min(center + 230, shape.width - 10), top],
                        [shape.width, top],
                        // [shape.width, shape.height],
                        // [0, shape.height],
                        // [0, top],
                        [shape.width, top - 2],
                        [Math.min(center + 230, shape.width - 10), top - 2],
                        [Math.min(center + 220, shape.width - 20), top - 12],
                        [center + 50, top - 12],
                        [center + 40, top - 2],
                        [center - 40, top - 2],
                        [center - 50, top - 12],
                        [Math.max(center - 220, 20), top - 12],
                        [Math.max(center - 230, 10), top - 2],
                        [0, top - 2],
                        [0, top],
                    ],
                };
            });
        }
    }
}
window.customElements.define('view-main', Main);

var Stylesheet = ":host {\r\n    display: block;\r\n    position: relative;\r\n    overflow: hidden;\r\n    width: 100%;\r\n    height: 100%;\r\n    min-height: 50px;\r\n}\r\n\r\n#background-canvas {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    z-index: -1;\r\n    pointer-events: none;\r\n}\r\n\r\n.content-slot {\r\n    display: block;\r\n    position: relative;\r\n    z-index: 1;\r\n    width: 100%;\r\n    height: 100%;\r\n}";

/**
 * Componente CustomShape
 * Encapsula um canvas que se auto-redesenha ao redimensionar a tag.
 * Utiliza Shadow DOM e a técnica de Layering para manter o canvas como background.
 */
class CustomShape extends View {
    static sheet;
    observer = null;
    canvas = null;
    tasks = [];
    constructor() {
        super(true);
        this.tasks = [];
        if (!CustomShape.sheet) {
            CustomShape.sheet = new CSSStyleSheet();
            CustomShape.sheet.replace(Stylesheet);
        }
        this.shadow.adoptedStyleSheets = [
            CustomShape.sheet,
        ];
    }
    get width() {
        return this.canvas?.width || 0;
    }
    get height() {
        return this.canvas?.height || 0;
    }
    polygon(task) {
        this.tasks.push(() => {
            const { color, points } = task();
            if (!this.canvas)
                return;
            const ctx = this.canvas.getContext('2d');
            if (!ctx)
                return;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fill();
        });
        this.handler();
    }
    handler() {
        if (!this.canvas)
            return;
        const rect = this.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        // Ajusta a resolução interna do canvas para evitar borrões
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;
        const width = this.canvas.width;
        const height = this.canvas.height;
        // Limpa o canvas
        ctx.clearRect(0, 0, width, height);
        this.tasks.forEach((draw) => {
            draw();
        });
    }
    /**
     * Renderiza a estrutura do componente
     */
    render() {
        this.canvas = HyperTextMarkupLanguage.create("canvas", { id: "background-canvas" });
        return [
            this.canvas,
            HyperTextMarkupLanguage.create("div", { class: "content-slot" },
                HyperTextMarkupLanguage.create("slot", null))
        ];
    }
    /**
     * Chamado quando o elemento é conectado ao DOM
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.canvas) {
            this.observer = new ResizeObserver(() => this.handler());
            this.observer.observe(this);
            this.handler();
        }
    }
    /**
     * Chamado quando o elemento é desconectado do DOM
     */
    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        super.disconnectedCallback();
    }
}
// Registro do Custom Element
window.customElements.define('custom-shape', CustomShape);

window.document.body.insertAdjacentHTML('beforeend', '<view-main></view-main>');
//# sourceMappingURL=application.mjs.map
