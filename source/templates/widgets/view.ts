export default class View extends HTMLElement {
    private readonly element: ShadowRoot

    public constructor() {
        super()
        this.element = this.attachShadow({
            mode: 'closed',
        })
    }

    public get className(): string {
        return this.getAttribute('class') ?? ''
    }

    public set className(value: string) {
        this.setAttribute('class', value)
        this.render(value)
    }

    public connectedCallback(): void {
        this.render(this.className)
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue !== newValue) {
            switch (name) {
                case 'class':
                    return this.render(newValue)
                default:
                    break
            }
        }
    }

    private render(classValue: string): void {
        switch (classValue) {
            case 'window':
                this.element.innerHTML = `
                    <link rel="stylesheet" href="assets/stylesheet/widgets/view.css">
                    <div class="bacground"></div>
                    <slot></slot>
                `
                break
            default:
                this.element.innerHTML = '<slot></slot>'
                break
        }
    }
}