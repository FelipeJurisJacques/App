import Stylesheet from './Window.css'
import CloseIcon from '../../component/icon/Close.svg'
import CustomShape from '../../component/widget/CustomShape'

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
        const shape = <custom-shape id="window-header"></custom-shape> as CustomShape
        this.shandow.append(shape)
        this.shandow.append(this._element)
        this.shandow.append(<a href="/" id="window-close">{new CloseIcon()}</a>)
        requestAnimationFrame(() => {
            this.classList.add('visible')
        })
        if (shape) {
            shape.polygon(() => {
                const border = 3
                const margin = 0
                const height = shape.height / 2
                const path: Array<[number, number]> = []
                path.push([height, margin])
                path.push([shape.width - (border + margin), margin])
                path.push([shape.width - margin, border + margin])
                path.push([shape.width - margin, shape.height - (border + margin)])
                path.push([shape.width - (border + margin), shape.height - margin])
                path.push([border + margin, shape.height - margin])
                path.push([margin, shape.height - (border + margin)])
                path.push([margin, height])
                path.push([height, margin])
                return {
                    points: path,
                    color: window.getComputedStyle(window.document.documentElement).getPropertyValue('--primary-color'),
                }
            })
        }
        this.shandow.addEventListener('click', event => {
            if (event.target && (event.target instanceof SVGElement || event.target instanceof HTMLElement)) {
                if (event.target.closest('#window-close')) {
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
