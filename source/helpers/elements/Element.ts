export default abstract class Element {
    private _style?: InstanceType<typeof Element.Style>
    protected dom?: HTMLElement | SVGElement
    private _handlers?: Map<string, Function>
    private _attributes?: Map<string, string>
    private _transform?: InstanceType<typeof Element.Transform>

    public abstract get tag(): string

    public abstract render(parent: HTMLElement | SVGElement): void

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

    public get transform(): InstanceType<typeof Element.Transform> {
        if (!this._transform) {
            this._transform = new Element.Transform(this)
        }
        return this._transform
    }

    public onRender(event: Function): void {
        if (!this._handlers) {
            this._handlers = new Map()
        }
        this._handlers.set('resize', event)
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
        private _style?: CSSStyleDeclaration

        public constructor(element: Element) {
            this._style = element.dom?.style
        }
    }
}