export default abstract class Widget extends HTMLElement {
    protected readonly shadow: ShadowRoot

    public constructor(opened: boolean) {
        super()
        this.shadow = this.attachShadow({
            mode: opened ? 'open' : 'closed',
        })
    }

    public adoptedCallback(): void { }

    public connectedCallback(): void { }

    public disconnectedCallback(): void { }

    public connectedMoveCallback(): void { }

    public attributeChangedCallback(name: string, old: string, value: string): void { }
}