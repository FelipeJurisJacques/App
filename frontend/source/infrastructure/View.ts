export default abstract class View extends HTMLElement {
    protected readonly shadow: ShadowRoot

    public abstract render(): Element[]
    public abstract handler(): void

    public constructor(opened: boolean = false) {
        super()
        this.shadow = this.attachShadow({
            mode: opened ? 'open' : 'closed',
        })
    }

    public adoptedCallback(): void { }

    public connectedCallback(): void {
        this.shadow.append(...this.render())
        this.handler()
    }

    public disconnectedCallback(): void {
        this.shadow.innerHTML = ''
    }

    public connectedMoveCallback(): void { }

    public attributeChangedCallback(name: string, old: string, value: string): void {
        window.console.log(name, old, value)
    }
}