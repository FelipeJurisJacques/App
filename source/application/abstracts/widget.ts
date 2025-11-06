export default abstract class Widget extends HTMLElement {
    protected readonly shadow: ShadowRoot

    public constructor(opened: boolean = false) {
        super()
        this.shadow = this.attachShadow({
            mode: opened ? 'open' : 'closed',
        })
    }

    protected handler(): void { }
    protected destroy(): void { }
    protected abstract build(): Promise<string>

    public adoptedCallback(): void { }

    public connectedCallback(): void {
        this.build().then(content => {
            this.shadow.innerHTML = content
            this.handler()
        })
    }

    public disconnectedCallback(): void {
        this.shadow.innerHTML = ''
        this.destroy()
    }

    public connectedMoveCallback(): void { }

    public attributeChangedCallback(name: string, old: string, value: string): void { }
}