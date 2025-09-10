export default class Button extends HTMLElement {
    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        shadow.innerHTML = '<slot></slot>'
        shadow.adoptedStyleSheets = this.getStyle()
    }

    protected getStyle(): Array<CSSStyleSheet> {
        return []
    }
}