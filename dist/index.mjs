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
        shadow.innerHTML = '<slot></slot>';
        shadow.adoptedStyleSheets = this.getStyle();
    }
    getStyle() {
        return [];
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
window.customElements.define('widget-view', View);
window.customElements.define('widget-button', Button);
window.customElements.define('icon-dark', Dark);
window.customElements.define('icon-light', Light);
window.customElements.define('icon-high-contrast', HighContrast);
const style = window.document.querySelector('style.theme');
const container = window.document.querySelector('widget-view');
if (style && container && container instanceof View) {
    container.innerHTML = `<widget-bar>
        <widget-button class="theme"></widget-button>
    </widget-bar>`;
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
}
// window.document.body.insertAdjacentHTML(
//     'beforeend',
//     '<script type="module" src="dist/application.mjs" async></script>'
// )
