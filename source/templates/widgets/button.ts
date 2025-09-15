export default class Button extends HTMLElement {
    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        shadow.innerHTML = '<style>:host(:hover) { cursor: pointer; }</style><slot></slot>'
    }

    protected getStyle(): Array<CSSStyleSheet> {
        return []
    }
}