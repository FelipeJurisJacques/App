import Type from "../events/Type"
import Event from "../events/Event"
import Render from "../events/Render"

export interface IElement {
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
        backgroundSize?: string
        backgroundColor?: string
        backgroundImage?: string
        backgroundRepeat?: string
        backgroundPosition?: string
    }
    onRender?: Function
}

export default abstract class Element {
    private _children?: Element[]
    protected dom?: HTMLElement | SVGElement
    private _attributes?: Map<string, string>
    private _style?: InstanceType<typeof Element.Style>
    private _handler?: InstanceType<typeof Element.Subject>
    private _transform?: InstanceType<typeof Element.Transform>

    public constructor(element: IElement = {}) {
        if (element.onRender) {
            this.handler.subscribe(Type.Render, element.onRender)
        }
        if (element.style) {
            this.handler.subscribe(Type.Render, () => {
                if (element.style?.backgroundColor) {
                    this.style.backgroundColor = element.style.backgroundColor
                }
                if (element.style?.backgroundImage) {
                    this.style.backgroundImage = element.style.backgroundImage
                }
                if (element.style?.backgroundSize) {
                    this.style.backgroundSize = element.style.backgroundSize
                }
                if (element.style?.backgroundPosition) {
                    this.style.backgroundPosition = element.style.backgroundPosition
                }
                if (element.style?.backgroundRepeat) {
                    this.style.backgroundRepeat = element.style.backgroundRepeat
                }
            })
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

    public get style(): InstanceType<typeof Element.Style> {
        if (!this._style) {
            this._style = new Element.Style(this)
        }
        return this._style
    }

    public get children(): Element[] {
        if (!this._children) {
            this._children = []
        }
        return this._children
    }

    public get transform(): InstanceType<typeof Element.Transform> {
        if (!this._transform) {
            this._transform = new Element.Transform(this)
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
        if (this._handler) {
            this._handler.notify(new Render(this))
        }
    }

    public onRender(observer: Function): void {
        this.handler.subscribe(Type.Render, observer)
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

    protected set children(children: Element[]) {
        this._children = children
    }

    protected get attributes(): Map<string, string> {
        if (!this._attributes) {
            this._attributes = new Map()
        }
        return this._attributes
    }

    protected get handler(): InstanceType<typeof Element.Subject> {
        if (!this._handler) {
            this._handler = new Element.Subject(this)
        }
        return this._handler
    }

    public static Transform = class {
        private _rect?: DOMRect

        public constructor(element: Element) {
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
        private _element: Element

        public constructor(element: Element) {
            this._element = element
        }

        public get backgroundImage(): string {
            return this._style?.backgroundImage ?? ''
        }

        public get backgroundSize(): string {
            return this._style?.backgroundSize ?? ''
        }

        public get backgroundPosition(): string {
            return this._style?.backgroundPosition ?? ''
        }

        public get backgroundRepeat(): string {
            return this._style?.backgroundRepeat ?? ''
        }

        public get backgroundColor(): string {
            return this._style?.backgroundColor ?? ''
        }

        public set backgroundImage(value: string) {
            if (this._style) {
                this._style.backgroundImage = value
            }
        }

        public set backgroundSize(value: string) {
            if (this._style) {
                this._style.backgroundSize = value
            }
        }

        public set backgroundPosition(value: string) {
            if (this._style) {
                this._style.backgroundPosition = value
            }
        }

        public set backgroundRepeat(value: string) {
            if (this._style) {
                this._style.backgroundRepeat = value
            }
        }

        public set backgroundColor(value: string) {
            if (this._style) {
                this._style.backgroundColor = value
            }
        }

        private get _style(): CSSStyleDeclaration | null {
            return this._element.dom?.style ?? null
        }
    }

    public static Subject = class {
        private _element: Element
        private _handlers: Map<Type, Function[]>

        public constructor(element: Element) {
            this._element = element
            this._handlers = new Map()
        }

        public subscribe(event: Type, callback: Function): void {
            const handlers = this._handlers.get(event)
            if (handlers) {
                handlers.push(callback)
            } else {
                this._handlers.set(event, [callback])
            }
        }

        public notify(event: Event) {
            const handlers = this._handlers.get(event.type)
            if (handlers) {
                for (const handler of handlers) {
                    handler(event)
                }
            }
        }
    }
}