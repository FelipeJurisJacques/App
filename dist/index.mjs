let Route$1 = class Route {
    paths;
    render;
    constructor(paths, render) {
        this.paths = paths;
        this.render = render;
    }
    checkPath(path) {
        return this.paths.includes(path);
    }
    build(document) {
        return this.render(document);
    }
};

class Route {
    static routes = [];
    static current = null;
    static displaying;
    static go(path) {
        for (let route of Route.routes) {
            if (route !== Route.current && route.checkPath(path)) {
                console.info(`ROUTE: ${path}`);
                Route.render(route);
                window.history.pushState({}, '', path);
                break;
            }
        }
    }
    static push(path, render) {
        const util = new Route$1(typeof path === 'string' ? [path] : path, render);
        Route.routes.push(util);
        Route.check();
    }
    static checkPath(path) {
        for (let route of Route.routes) {
            if (route.checkPath(path)) {
                return true;
            }
        }
        return false;
    }
    static check() {
        const path = window.location.pathname;
        for (let route of Route.routes) {
            if (route !== Route.current && route.checkPath(path)) {
                console.info(`ROUTE: ${path}`);
                Route.render(route);
                break;
            }
        }
    }
    static render(route) {
        Route.current = route;
        if (Route.displaying && Route.displaying.isConnected) {
            Route.displaying.remove();
        }
        const element = route.build(window.document);
        Route.displaying = element;
        document.body.append(element);
        // window.document.body.insertAdjacentHTML(
        //     'beforeend',
        //     '<script type="module" src="dist/application.mjs" async></script>'
        // )
    }
}

class Widget extends HTMLElement {
    shadow;
    constructor(opened) {
        super();
        this.shadow = this.attachShadow({
            mode: opened ? 'open' : 'closed',
        });
    }
    adoptedCallback() { }
    connectedCallback() { }
    disconnectedCallback() { }
    connectedMoveCallback() { }
    attributeChangedCallback(name, old, value) { }
}

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

class Target {
    ownerView;
    ownerQuery;
    ownerTarget;
    constructor(view) {
        this.ownerView = view;
        this.ownerQuery = null;
        this.ownerTarget = null;
    }
    get view() { return this.ownerView; }
    onTarget(element) {
        this.ownerQuery = null;
        this.ownerTarget = element;
    }
    onQuery(query) {
        this.ownerQuery = query;
        this.ownerTarget = null;
    }
    handler(event, type, dispatcher) {
        if (event.target instanceof HTMLElement) {
            if (this.ownerQuery) {
                if (this.ownerTarget) {
                    if (this.ownerTarget.contains(event.target)) {
                        this.invoke(type, event, event.target, dispatcher);
                    }
                }
                else {
                    this.invoke(type, event, event.target, dispatcher);
                }
            }
            else if (this.ownerTarget) {
                if (this.ownerTarget === event.target
                    || this.ownerTarget.contains(event.target)) {
                    this.invoke(type, event, event.target, dispatcher);
                }
            }
        }
    }
    invoke(type, event, target, dispatcher) {
        if (this.ownerQuery) {
            const element = target.closest(this.ownerQuery);
            if (element && element instanceof HTMLElement) {
                console.info(`DISPACH[${type}]`, dispatcher);
                dispatcher(new Dispatcher(event, type, element));
            }
        }
        else if (this.ownerTarget) {
            console.info(`DISPACH[${type}]`, dispatcher);
            dispatcher(new Dispatcher(event, type, this.ownerTarget));
        }
    }
}

class Group {
    origin;
    listeners;
    constructor(view, listener) {
        this.listeners = [
            listener,
        ];
        this.origin = view;
        view.shadowRoot.addEventListener('click', event => {
            for (let listener of this.listeners) {
                listener.handler(event);
            }
        });
    }
    push(listener) {
        this.listeners.push(listener);
    }
    get view() { return this.origin; }
}

var Type;
(function (Type) {
    Type[Type["TAP"] = 0] = "TAP";
    Type[Type["CLICK"] = 1] = "CLICK";
    Type[Type["ACTION"] = 2] = "ACTION";
})(Type || (Type = {}));
var Type$1 = Type;

class Listener {
    static groups = [];
    type;
    signatured;
    event;
    static push(view, listener) {
        console.info('LISTEN: ', listener);
        for (let group of Listener.groups) {
            if (view === group.view) {
                group.push(listener);
                return;
            }
        }
        Listener.groups.push(new Group(view, listener));
    }
    constructor(signature, type, event) {
        this.type = type;
        this.event = event;
        this.signatured = signature;
    }
    get signature() { return this.signatured; }
    handler(event) {
        if (this.isType(event)) {
            this.signatured.handler(event, this.type, this.event);
        }
    }
    isType(event) {
        switch (this.type) {
            case Type$1.ACTION:
                return event.type === 'click';
            default:
                return false;
        }
    }
}

class Signature {
    targetable;
    constructor(target) { this.targetable = target; }
    get target() { return this.targetable; }
    onAction(event) {
        const listener = new Listener(this, Type$1.ACTION, event);
        Listener.push(this.targetable.view, listener);
        return listener;
    }
    handler(event, type, dispatcher) {
        this.targetable.handler(event, type, dispatcher);
    }
}

let View$1 = class View extends Widget {
    constructor() {
        super(true);
        this.listen('widget-button').onAction(event => {
            const action = event.target.getAttribute('action');
            if (action) {
                const method = event.target.getAttribute('method') || 'GET';
                const target = event.target.getAttribute('target') || 'self';
                switch (method) {
                    case 'GET':
                        switch (target) {
                            case 'top':
                                window.open(action, '_top');
                                break;
                            case 'self':
                                if (Route.checkPath(action)) {
                                    Route.go(action);
                                }
                                else {
                                    window.open(action, '_self');
                                }
                                break;
                            case 'blank':
                                window.open(action, '_blank');
                                break;
                            case 'parent':
                                window.open(action, '_parent');
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
    connectedCallback() {
        this.handler();
    }
    listen(query) {
        const target = new Target(this);
        target.onQuery(query);
        return new Signature(target);
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
    constructor() {
        super();
        let icon = '';
        this.loop = null;
        switch (window.localStorage.getItem('theme') ?? 'dark') {
            case 'light':
                icon = '<icon-light></icon-light>';
                this.ownerDocument.body.setAttribute('theme', 'light');
                break;
            case 'high_contrast':
                icon = '<icon-high-contrast></icon-high-contrast>';
                this.ownerDocument.body.setAttribute('theme', 'high_contrast');
                break;
            default:
                icon = '<icon-dark></icon-dark>';
                this.ownerDocument.body.setAttribute('theme', 'dark');
                break;
        }
        this.shadow.innerHTML = `
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
    handler() {
        const top = this.shadow.querySelector('widget-top');
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
        const theme = this.shadow.querySelector('widget-button.theme');
        if (theme) {
            this.listen('widget-button.theme').onAction(() => {
                switch (window.localStorage.getItem('theme') ?? 'dark') {
                    case 'light':
                        theme.innerHTML = '<icon-high-contrast />';
                        window.localStorage.setItem('theme', 'high_contrast');
                        this.ownerDocument.body.setAttribute('theme', 'high_contrast');
                        break;
                    case 'high_contrast':
                        theme.innerHTML = '<icon-dark />';
                        window.localStorage.setItem('theme', 'dark');
                        this.ownerDocument.body.setAttribute('theme', 'dark');
                        break;
                    default:
                        theme.innerHTML = '<icon-light />';
                        window.localStorage.setItem('theme', 'light');
                        this.ownerDocument.body.setAttribute('theme', 'light');
                        break;
                }
            });
        }
    }
    disconnectedCallback() {
        if (this.loop) {
            Theread.stop(this.loop);
            this.loop = null;
        }
    }
}

let Calendar$1 = class Calendar extends View$1 {
    constructor() {
        super();
        let icon = '';
        switch (window.localStorage.getItem('theme') ?? 'dark') {
            case 'light':
                icon = '<icon-light></icon-light>';
                this.ownerDocument.body.setAttribute('theme', 'light');
                break;
            case 'high_contrast':
                icon = '<icon-high-contrast></icon-high-contrast>';
                this.ownerDocument.body.setAttribute('theme', 'high_contrast');
                break;
            default:
                icon = '<icon-dark></icon-dark>';
                this.ownerDocument.body.setAttribute('theme', 'dark');
                break;
        }
        this.shadow.innerHTML = `
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
    handler() {
        this.className = 'window';
    }
};

class Bar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'closed',
        });
        shadow.innerHTML = `
            <slot></slot>
            <link rel="stylesheet" href="assets/stylesheet/widgets/bar.css">
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
            <link rel="stylesheet" href="assets/stylesheet/widgets/top.css">
            <div class="content">
                <slot></slot>
            </div>
            <div class="bacground"></div>
        `;
    }
}

class View extends HTMLElement {
    element;
    constructor() {
        super();
        this.element = this.attachShadow({
            mode: 'closed',
        });
    }
    get className() {
        return this.getAttribute('class') ?? '';
    }
    set className(value) {
        this.setAttribute('class', value);
        this.render(value);
    }
    connectedCallback() {
        this.render(this.className);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case 'class':
                    return this.render(newValue);
            }
        }
    }
    render(classValue) {
        switch (classValue) {
            case 'window':
                this.element.innerHTML = `
                    <link rel="stylesheet" href="assets/stylesheet/widgets/view.css">
                    <div class="bacground"></div>
                    <slot></slot>
                `;
                break;
            default:
                this.element.innerHTML = '<slot></slot>';
                break;
        }
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
window.customElements.define('view-main', Main);
window.customElements.define('view-calendar', Calendar$1);
Route.push('/', document => {
    return document.createElement('view-main');
});
Route.push('/index.html', document => {
    return document.createElement('view-main');
});
Route.push('/calendar', document => {
    return document.createElement('view-calendar');
});
