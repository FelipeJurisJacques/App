import Stylesheet from './Files.css'
import View from '../infrastructure/View'
import CloseIcon from '../component/icon/Close.svg'

export default class Files extends View {
    public constructor() {
        super(false)
    }

    public render(): Element[] {
        this.shadow.adoptedStyleSheets = [
            Stylesheet,
        ]
        return [
            <div class="background-fui"></div>,
            <a href="/" class="close-button" id="back-link">
                {CloseIcon}
            </a>,
            <div class="container">
                <h1>Files_Explorer</h1>
                <div class="content">
                    <p>Repository data access initialized... [No files found]</p>
                </div>
            </div>
        ]
    }

    public handler(): void {
        // Trigger opening animation
        requestAnimationFrame(() => {
            this.classList.add('visible')
        })

        const backLink = this.shadow.querySelector('#back-link') as HTMLAnchorElement
        if (backLink) {
            backLink.addEventListener('click', event => {
                event.preventDefault()
                this.classList.add('closing')
                this.classList.remove('visible')
                setTimeout(() => {
                    const container = window.document.querySelector('#container')
                    if (container) {
                        container.innerHTML = ''
                        container.append(<view-main></view-main>)
                    }
                }, 300)
            })
        }
    }
}

window.customElements.define('view-files', Files)
