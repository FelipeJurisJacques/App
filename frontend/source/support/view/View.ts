interface Configuration {
    opened?: boolean
    stylesheet?: () => Array<CSSStyleSheet>
}

export default abstract class View extends HTMLElement {
    protected readonly element: ShadowRoot
    protected readonly configuration: Configuration

    public constructor(configuration: Configuration) {
        super()
        this.configuration = configuration
        this.element = this.attachShadow({
            mode: configuration.opened ? 'open' : 'closed',
        })
    }

    public adoptedCallback(): void { }

    public connectedCallback(): void {
        if (this.configuration.stylesheet) {
            this.element.adoptedStyleSheets = this.configuration.stylesheet()
        }
        this.render()
        this.handler()
    }

    public disconnectedCallback(): void {
        this.element.innerHTML = ''
    }

    public connectedMoveCallback(): void { }

    public attributeChangedCallback(name: string, old: string, value: string): void {
        window.console.log(name, old, value)
    }

    protected render(): void { }
    protected handler(): void { }
}