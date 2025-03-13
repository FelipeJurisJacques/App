import Style from "../styles/Style"

export default abstract class Component {
    private _style?: Style
    private _children?: Component[]
    protected dom?: HTMLElement | SVGElement
    private _handlers?: Map<string, Function>
    private _attributes?: Map<string, string>

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

    public get style(): Style {
        if (!this._style) {
            this._style = new Style()
        }
        return this._style
    }

    public get children(): Component[] {
        if (!this._children) {
            this._children = []
        }
        return this._children
    }

    public set style(style: Style) {
        this._style = style
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
}