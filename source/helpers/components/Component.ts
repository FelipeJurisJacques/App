export default abstract class Component {
    protected children?: Component[]
    protected dom?: HTMLElement | SVGElement
    protected attributes?: Record<string, string> = {}

    public abstract get tag(): string

    public build(parent: HTMLElement | SVGElement): void {
        if (this.tag === 'svg') {
            this.dom = parent.ownerDocument.createElementNS('http://www.w3.org/2000/svg', this.tag)
        } else {
            this.dom = parent.ownerDocument.createElement(this.tag)
        }
        if (this.attributes) {
            for (const key in this.attributes) {
                this.dom.setAttribute(key, this.attributes[key])
            }
        }
        parent.append(this.dom)
        if (this.children) {
            for (const child of this.children) {
                child.build(this.dom)
            }
        }
    }

    public toString(): string {
        let result = ''
        if (this.dom) {
            result = this.dom.outerHTML
        } else {
            result = `<${this.tag}`
            if (this.attributes) {
                for (const key in this.attributes) {
                    result += ` ${key}="${this.attributes[key]}"`
                }
            }
            result += '>'
            if (this.children) {
                for (const child of this.children) {
                    result += child.toString()
                }
            }
            result += `</${this.tag}>`
        }
        return result
    }
}