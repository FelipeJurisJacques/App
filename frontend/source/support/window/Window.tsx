import Stylesheet from './Window.css'
import CloseIcon from '../../component/icon/Close.svg'

interface Configuration {
    stylesheet?: () => Array<CSSStyleSheet>
}

export default abstract class Window extends HTMLElement {
    private _element?: HTMLElement
    private readonly shandow: ShadowRoot
    protected readonly configuration: Configuration
    private static _stylesheet: null | CSSStyleSheet = null

    public constructor(configuration: Configuration) {
        super()
        this.configuration = configuration
        this.shandow = this.attachShadow({
            mode: 'closed',
        })
    }

    protected get element(): HTMLElement { return this._element! }

    public adoptedCallback(): void { }

    public connectedCallback(): void {
        if (!Window._stylesheet) {
            Window._stylesheet = new Stylesheet()
        }
        const stylesheet = this.configuration.stylesheet ? this.configuration.stylesheet() : []
        stylesheet.push(Window._stylesheet)
        this.shandow.adoptedStyleSheets = stylesheet
        this._element = <div class="container"></div>
        this.shandow.append(<a href="/" class="close-button" id="close-window">{new CloseIcon()}</a>)
        this.shandow.append(this.element)
        requestAnimationFrame(() => {
            this.classList.add('visible')
        })
        this.shandow.addEventListener('click', event => {
            if (event.target && (event.target instanceof SVGElement || event.target instanceof HTMLElement)) {
                if (event.target.closest('#close-window')) {
                    event.preventDefault()
                    this.classList.add('closing')
                    this.classList.remove('visible')
                    setTimeout(() => {
                        this.remove()
                    }, 300)
                }
            }
        })
        this.render()
        this.handler()
    }

    public disconnectedCallback(): void {
        this._element?.remove()
        this.shandow.innerHTML = ''
    }

    public connectedMoveCallback(): void { }

    public attributeChangedCallback(name: string, old: string, value: string): void {
        window.console.log(name, old, value)
    }

    protected render(): void { }
    protected handler(): void { }
}