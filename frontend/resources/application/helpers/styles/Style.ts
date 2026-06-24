export default class Style {
    protected style?: CSSStyleDeclaration
    protected styles?: Map<string, string>

    public constructor(declaration?: CSSStyleDeclaration) {
        if (declaration) {
            this.style = declaration
        } else {
            this.styles = new Map()
        }
    }

    public merge(style: Style): void {
        if (this.style) {
            this.style.cssText += style.toString()
        } else {
            this.styles!.forEach((value, key) => {
                this.styles!.set(key, value)
            })
        }
    }

    public override(style: Style): void {
        if (this.style) {
            this.style.cssText = style.toString()
        } else {
            this.styles!.clear()
            this.styles!.forEach((value, key) => {
                this.styles!.set(key, value)
            })
        }
    }
}