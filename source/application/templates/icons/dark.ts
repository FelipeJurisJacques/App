export default class Dark extends HTMLElement {
    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        const width = this.getAttribute('width') ?? '30'
        const height = this.getAttribute('height') ?? '30'
        shadow.innerHTML = `
            <svg
                width="${width}"
                height="${height}"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `
    }
}