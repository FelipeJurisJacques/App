class Dispatcher {
    origin;
    type_enum;
    element;
    constructor(event, type, target) {
        this.type_enum = type;
        this.origin = event;
        this.element = target;
    }
    get type() {
        return this.type_enum;
    }
    get target() {
        return this.element;
    }
}

var Type;
(function (Type) {
    Type[Type["TAP"] = 0] = "TAP";
    Type[Type["CLICK"] = 1] = "CLICK";
    Type[Type["ACTION"] = 2] = "ACTION";
})(Type || (Type = {}));
var Type$1 = Type;

let Listener$1 = class Listener {
    type;
    queryes;
    event;
    static listeners = [];
    static documents = [];
    static notify(event) {
        for (let listener of Listener.listeners) {
            listener.handler(event);
        }
    }
    constructor(type, query, event) {
        this.type = type;
        this.event = event;
        this.queryes = Array.isArray(query) ? query : [
            query,
        ];
        for (let query of this.queryes) {
            if (query instanceof HTMLElement
                && query.ownerDocument
                && !Listener.documents.includes(query.ownerDocument)) {
                Listener.documents.push(query.ownerDocument);
                query.ownerDocument.addEventListener('click', Listener.notify);
            }
        }
        if (Listener.documents.length === 0) {
            Listener.documents.push(window.document);
            window.document.addEventListener('click', Listener.notify);
        }
        Listener.listeners.push(this);
    }
    handler(event) {
        if (this.is_type(event) && this.is_query(event)) {
            this.event(new Dispatcher(event, this.type, this.target(event)));
        }
    }
    is_type(event) {
        switch (this.type) {
            case Type$1.ACTION:
                return event.type === 'click';
            default:
                return false;
        }
    }
    is_query(event) {
        if (event.target && event.target instanceof HTMLElement && event.target.ownerDocument) {
            for (let query of this.queryes) {
                if (typeof query === 'string') {
                    if (event.target.closest(query)) {
                        return true;
                    }
                }
                else if (query.ownerDocument && query.ownerDocument === event.target.ownerDocument) {
                    if (query === event.target || query.contains(event.target)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    target(event) {
        if (event.target && event.target instanceof HTMLElement && event.target.ownerDocument) {
            for (let query of this.queryes) {
                if (typeof query === 'string') {
                    let target = event.target.closest(query);
                    if (target) {
                        return target;
                    }
                }
                else if (query.ownerDocument && query.ownerDocument === event.target.ownerDocument) {
                    if (query === event.target || query.contains(event.target)) {
                        return query;
                    }
                }
            }
        }
        return event.target;
    }
};

class Listener {
    query;
    static listen(query) {
        return new Listener(query);
    }
    constructor(query) {
        this.query = query;
    }
    onAction(event) {
        return new Listener$1(Type$1.ACTION, this.query, event);
    }
}

let View$1 = class View {
    node;
    constructor(view) {
        this.node = view;
    }
    get element() {
        return this.node;
    }
    listen(selector) {
        return Listener.listen(selector);
    }
};

class Theread {
    static loop(ms, event) {
        event();
        return window.setInterval(event, ms);
    }
    static stop(id) {
        window.clearInterval(id);
    }
}

class Main extends View$1 {
    loop;
    constructor(view) {
        super(view);
        this.loop = null;
    }
    handler() {
        const top = this.element.querySelector('widget-top');
        if (top) {
            this.loop = Theread.loop(60000, () => {
                const date = new Date();
                top.innerHTML = `
                    ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
                    <br>
                    ${date.toLocaleDateString()}
                `;
            });
        }
        const theme = this.element.querySelector('widget-button.theme');
        if (theme) {
            this.listen('widget-button.theme').onAction(() => {
                switch (window.localStorage.getItem('theme') ?? 'dark') {
                    case 'light':
                        theme.innerHTML = '<icon-high-contrast />';
                        window.localStorage.setItem('theme', 'high_contrast');
                        this.element.ownerDocument.body.setAttribute('theme', 'high_contrast');
                        break;
                    case 'high_contrast':
                        theme.innerHTML = '<icon-dark />';
                        window.localStorage.setItem('theme', 'dark');
                        this.element.ownerDocument.body.setAttribute('theme', 'dark');
                        break;
                    default:
                        theme.innerHTML = '<icon-light />';
                        window.localStorage.setItem('theme', 'light');
                        this.element.ownerDocument.body.setAttribute('theme', 'light');
                        break;
                }
            });
        }
    }
    render() {
        let icon = '';
        switch (window.localStorage.getItem('theme') ?? 'dark') {
            case 'light':
                icon = '<icon-light></icon-light>';
                this.element.ownerDocument.body.setAttribute('theme', 'light');
                break;
            case 'high_contrast':
                icon = '<icon-high-contrast></icon-high-contrast>';
                this.element.ownerDocument.body.setAttribute('theme', 'high_contrast');
                break;
            default:
                icon = '<icon-dark></icon-dark>';
                this.element.ownerDocument.body.setAttribute('theme', 'dark');
                break;
        }
        return `
            <widget-top></widget-top>
            <widget-bar>
                <widget-button class="theme">
                    ${icon}
                </widget-button>
                <widget-button class="calendar" type="link" action="/calendar">
                    <icon-calendar>
                </widget-button>
            </widget-bar>
        `;
    }
    destroy() {
        if (this.loop) {
            Theread.stop(this.loop);
            this.loop = null;
        }
    }
}

let Route$1 = class Route {
    builder;
    compatible;
    constructor(view, paths) {
        if (view === View$1 || Object.getPrototypeOf(view) !== View$1) {
            throw new Error('Invalid view class');
        }
        else {
            this.builder = view;
            this.compatible = paths;
        }
    }
    get view() {
        return this.builder;
    }
    get paths() {
        return this.compatible;
    }
    build() {
        const view = this.builder;
        window.document.querySelectorAll('widget-view').forEach(element => element.remove());
        const element = window.document.createElement('widget-view');
        window.document.body.appendChild(element);
        const instance = new view(element);
        element.innerHTML = instance.render();
        instance.handler();
        return instance;
    }
};

class Route {
    static routes = [];
    static displaying = null;
    static push(path, view) {
        for (const route of Route.routes) {
            if (view === route.view) {
                if (!route.paths.includes(path)) {
                    route.paths.push(path);
                    Route.check();
                    return;
                }
            }
        }
        Route.routes.push(new Route$1(view, [path]));
        Route.check();
    }
    static check() {
        const path = window.location.pathname;
        for (let route of Route.routes) {
            if (route.paths.find(p => p === path)) {
                if (Route.displaying) {
                    Route.displaying.destroy();
                }
                Route.displaying = route.build();
                // window.document.body.insertAdjacentHTML(
                //     'beforeend',
                //     '<script type="module" src="dist/application.mjs" async></script>'
                // )
            }
        }
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

class View extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        shadow.innerHTML = '<slot></slot>';
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
    static listener = null;
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        shadow.innerHTML = '<style>:host(:hover) { cursor: pointer; }</style><slot></slot>';
        if (Button.listener === null) {
            Button.listener = new Listener$1(Type$1.ACTION, 'widget-button[type=link]', event => {
                const action = event.target.getAttribute('action');
                if (action) {
                    const method = event.target.getAttribute('method') || 'GET';
                    const target = event.target.getAttribute('target') || 'self';
                    switch (method) {
                        case 'GET':
                            switch (target) {
                                case 'self':
                                    window.open(action, '_self');
                                    break;
                                case 'blank':
                                    window.open(action, '_blank');
                                    break;
                                case 'parent':
                                    window.open(action, '_parent');
                                    break;
                                case 'top':
                                    window.open(action, '_top');
                                    break;
                                case 'popup':
                                    const width = event.target.getAttribute('width') || '600';
                                    const height = event.target.getAttribute('height') || '400';
                                    window.open(action, '_blank', `
                                        status=no,
                                        toolbar=no,
                                        menubar=no,
                                        location=no,
                                        resizable=yes,
                                        scrollbars=yes,
                                        left=100,top=100,
                                        width=${width},height=${height}
                                    `);
                                    break;
                            }
                            break;
                    }
                }
            });
        }
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
Route.push('/', Main);
Route.push('/index.html', Main);
