class Theread {
    static loop(ms, event) {
        event();
        return window.setInterval(event, ms);
    }
    static stop(id) {
        window.clearInterval(id);
    }
}

class Bar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        shadow.innerHTML = `
            <slot></slot>
            <link rel="stylesheet" href="stylesheet/widgets/bar.css">
            <div class="bacground">
                <div class="customization"></dv>
            </div>
        `;
    }
}

class Top extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        const path = [];
        const positions = [
            '50% -',
            '50% +',
        ];
        path.push(`0px 0px`);
        for (let i = 0; i < 20; i++) {
            let size = Math.round(1 * (i * 0.3 + 1));
            for (let position of positions) {
                path.push(`calc(${position} ${i * 10 + size + 70}px) 0px`);
                path.push(`calc(${position} ${i * 10 + size + 70 + size}px) 0px`);
                path.push(`calc(${position} ${i * 10 + size + 60 + size}px) 30px`);
                path.push(`calc(${position} ${i * 10 + size + 60}px) 30px`);
                path.push(`calc(${position} ${i * 10 + size + 70}px) 0px`);
            }
        }
        path.push(`0px 0px`);
        shadow.innerHTML = `
            <style>
                div.bacground {
                    clip-path: polygon(${path.join(', ')});
                }
            </style>
            <link rel="stylesheet" href="stylesheet/widgets/top.css">
            <div class="content">
                <slot></slot>
            </div>
            <div class="bacground"></div>
        `;
    }
}

class Dark extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        const width = this.getAttribute('width') ?? '30';
        const height = this.getAttribute('height') ?? '30';
        shadow.innerHTML = `
            <svg
                width="${width}"
                height="${height}"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
    }
}

var Type;
(function (Type) {
    Type[Type["NONE"] = 0] = "NONE";
    Type[Type["ACTION"] = 1] = "ACTION";
})(Type || (Type = {}));
class Listner {
    view;
    type;
    query;
    event;
    constructor(view, query) {
        this.view = view;
        this.event = null;
        this.query = query;
        this.type = Type.NONE;
    }
    onAction(event) {
        this.push(Type.ACTION, event);
    }
    notify(event) {
        switch (this.type) {
            case Type.ACTION:
                if (event.type === 'click') {
                    this.handler(event);
                }
                break;
            case Type.NONE:
        }
    }
    push(type, event) {
        this.type = type;
        this.event = event;
        this.view.listners.push(this);
    }
    handler(event) {
        if (this.event
            && event.target
            && event.target instanceof HTMLElement
            && this.view.contains(event.target)
            && event.target.closest(this.query)) {
            this.event(event);
        }
    }
}
class View extends HTMLElement {
    listners;
    static views = [];
    static documents = [];
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        shadow.innerHTML = '<slot></slot>';
        this.listners = [];
    }
    listen(query) {
        return new Listner(this, query);
    }
    connectedCallback() {
        View.views.push(this);
        for (let document of View.documents) {
            if (document === this.ownerDocument) {
                return;
            }
        }
        this.ownerDocument.addEventListener('click', event => {
            for (let listner of this.listners) {
                if (listner instanceof Listner) {
                    try {
                        listner.notify(event);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        });
        View.documents.push(this.ownerDocument);
    }
    disconnectedCallback() {
        this.listners.length = 0;
    }
}

class Light extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        const width = this.getAttribute('width') ?? '30';
        const height = this.getAttribute('height') ?? '30';
        shadow.innerHTML = `
            <svg
                fill="none"
                width="${width}"
                height="${height}"
                stroke-width="1.6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                />
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    }
}

class Button extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        shadow.innerHTML = '<style>:host(:hover) { cursor: pointer; }</style><slot></slot>';
    }
}

class Calendar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        const width = this.getAttribute('width') ?? '30';
        const height = this.getAttribute('height') ?? '30';
        shadow.innerHTML = `
            <svg
                width="${width}"
                height="${height}"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <rect x="7" y="13" width="2" height="2" fill="currentColor"/>
                <rect x="11" y="13" width="2" height="2" fill="currentColor"/>
                <rect x="15" y="13" width="2" height="2" fill="currentColor"/>
                <rect x="7" y="17" width="2" height="2" fill="currentColor"/>
                <rect x="11" y="17" width="2" height="2" fill="currentColor"/>
                <rect x="15" y="17" width="2" height="2" fill="currentColor"/>
            </svg>
        `;
    }
}

class Svg {
    static Path = class {
        static ellipticalArc(ray_x, ray_y, displacement_x, displacement_y, rotation = 0, large = 0, clockwise = true) {
            return `a${ray_x} ${ray_y} ${rotation} ${large} ${clockwise ? 1 : 0} ${displacement_x} ${displacement_y}`;
        }
        static move(x, y) {
            return `M${x} ${y}`;
        }
        static close() {
            return 'z';
        }
    };
}

class HighContrast extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        const width = this.getAttribute('width') ?? '30';
        const height = this.getAttribute('height') ?? '30';
        const path = `${Svg.Path.move(12, 5)}${Svg.Path.ellipticalArc(1, 1, 0, 14)}${Svg.Path.close()}`;
        shadow.innerHTML = `
            <svg
                width="${width}"
                height="${height}"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="9" fill="black"/>
                <path d="${path}" fill="white"/>
            </svg>
        `;
    }
}

window.customElements.define('widget-bar', Bar);
window.customElements.define('widget-top', Top);
window.customElements.define('widget-view', View);
window.customElements.define('widget-button', Button);
window.customElements.define('icon-dark', Dark);
window.customElements.define('icon-light', Light);
window.customElements.define('icon-calendar', Calendar);
window.customElements.define('icon-high-contrast', HighContrast);
const style = window.document.querySelector('style.theme');
const container = window.document.querySelector('widget-view');
if (style && container && container instanceof View) {
    container.innerHTML = `
        <widget-top></widget-top>
        <widget-bar>
            <widget-button class="theme"></widget-button>
            <widget-button class="calendar">
                <icon-calendar>
            </widget-button>
        </widget-bar>
    `;
    const theme = window.document.querySelector('widget-button.theme');
    if (theme) {
        switch (window.localStorage.getItem('theme') ?? 'dark') {
            case 'light':
                theme.innerHTML = '<icon-light />';
                window.document.body.setAttribute('theme', 'light');
                break;
            case 'high_contrast':
                theme.innerHTML = '<icon-high-contrast />';
                window.document.body.setAttribute('theme', 'high_contrast');
                break;
            default:
                theme.innerHTML = '<icon-dark />';
                window.document.body.setAttribute('theme', 'dark');
                break;
        }
        container.listen('widget-button.theme').onAction(() => {
            switch (window.localStorage.getItem('theme') ?? 'dark') {
                case 'light':
                    theme.innerHTML = '<icon-high-contrast />';
                    window.localStorage.setItem('theme', 'high_contrast');
                    window.document.body.setAttribute('theme', 'high_contrast');
                    break;
                case 'high_contrast':
                    theme.innerHTML = '<icon-dark />';
                    window.localStorage.setItem('theme', 'dark');
                    window.document.body.setAttribute('theme', 'dark');
                    break;
                default:
                    theme.innerHTML = '<icon-light />';
                    window.localStorage.setItem('theme', 'light');
                    window.document.body.setAttribute('theme', 'light');
                    break;
            }
        });
    }
    const top = window.document.querySelector('widget-top');
    if (top) {
        Theread.loop(60000, () => {
            const date = new Date();
            top.innerHTML = `
                ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
                <br>
                ${date.toLocaleDateString()}
            `;
        });
    }
}
// window.document.body.insertAdjacentHTML(
//     'beforeend',
//     '<script type="module" src="dist/application.mjs" async></script>'
// )
