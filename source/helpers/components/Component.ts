export interface IComponent {
    transform?: {
        x: number
        y: number
        width: number
        height: number
    }
    style?: {
        color?: string
        width?: string
        height?: string
        fontSize?: string
        fontWeight?: string
        fontFamily?: string
        backgroundColor?: string
    }
    onRender?: Function
}

export default abstract class Component {
    private _style?: InstanceType<typeof Component.Style>
    private _children?: Component[]
    protected dom?: HTMLElement | SVGElement
    private _handlers?: Map<string, Function>
    private _attributes?: Map<string, string>
    private _transform?: InstanceType<typeof Component.Transform>

    public constructor(component: IComponent = {}) {
        if (component.onRender) {
            this.handlers.set('render', component.onRender)
        }
    }

    public abstract get tag(): string

    public get id(): string {
        if (this._attributes) {
            const id = this._attributes.get('id')
            if (id) {
                return id
            }
        }
        return ''
    }

    public get style(): InstanceType<typeof Component.Style> {
        if (!this._style) {
            this._style = new Component.Style(this)
        }
        return this._style
    }

    public get children(): Component[] {
        if (!this._children) {
            this._children = []
        }
        return this._children
    }

    public get transform(): InstanceType<typeof Component.Transform> {
        if (!this._transform) {
            this._transform = new Component.Transform(this)
        }
        return this._transform
    }

    public render(parent: HTMLElement | SVGElement): void {
        const tag = this.tag
        if (tag === 'svg' || parent instanceof SVGElement) {
            this.dom = parent.ownerDocument.createElementNS('http://www.w3.org/2000/svg', tag)
        } else if (tag === 'body') {
            this.dom = parent.ownerDocument.body
        } else {
            this.dom = parent.ownerDocument.createElement(this.tag)
        }
        if (this._attributes) {
            const keys = this._attributes.keys()
            for (const key in keys) {
                let value = this._attributes.get(key)
                if (value) {
                    this.dom.setAttribute(key, value)
                }
            }
        }
        parent.append(this.dom)
        if (this._children) {
            for (const child of this._children) {
                child.render(this.dom)
            }
        }
        if (this.dom && this._handlers) {
            const event = this._handlers.get('resize')
            if (event) {
                event()
            }
        }
    }

    public onRender(event: Function): void {
        if (!this._handlers) {
            this._handlers = new Map()
        }
        this._handlers.set('resize', event)
    }

    public toString(): string {
        let result = ''
        if (this.dom) {
            result = this.dom.outerHTML
        } else {
            result = `<${this.tag}`
            if (this._attributes) {
                const keys = this._attributes.keys()
                for (const key in keys) {
                    result += ` ${key}="${this._attributes.get(key)}"`
                }
            }
            result += '>'
            if (this._children) {
                for (const child of this._children) {
                    result += child.toString()
                }
            }
            result += `</${this.tag}>`
        }
        return result
    }

    protected set children(children: Component[]) {
        this._children = children
    }

    protected get attributes(): Map<string, string> {
        if (!this._attributes) {
            this._attributes = new Map()
        }
        return this._attributes
    }

    protected get handlers(): Map<string, Function> {
        if (!this._handlers) {
            this._handlers = new Map()
        }
        return this._handlers
    }

    public static Transform = class {
        private _rect?: DOMRect

        public constructor(element: Component) {
            this._rect = element.dom?.getBoundingClientRect()
        }

        get width(): number {
            return this._rect?.width ?? 0.0
        }

        get height(): number {
            return this._rect?.height ?? 0.0
        }

        get x(): number {
            return this._rect?.x ?? 0.0
        }

        get y(): number {
            return this._rect?.y ?? 0.0
        }

        get top(): number {
            return this._rect?.top ?? 0.0
        }

        get right(): number {
            return this._rect?.right ?? 0.0
        }

        get bottom(): number {
            return this._rect?.bottom ?? 0.0
        }

        get left(): number {
            return this._rect?.left ?? 0.0
        }

        set x(value: number) {
            this._rect!.x = value
        }

        set y(value: number) {
            this._rect!.y = value
        }

        set width(value: number) {
            this._rect!.width = value
        }

        set height(value: number) {
            this._rect!.height = value
        }
    }

    public static Style = class {
        private _style?: CSSStyleDeclaration

        public constructor(element: Component) {
            this._style = element.dom?.style
        }
    }
}