export default class Light extends HTMLElement {
    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        const width = this.getAttribute('width') ?? '30'
        const height = this.getAttribute('height') ?? '30'
        shadow.innerHTML = `
            <svg
                fill="none"
                width="${width}"
                height="${height}"
                stroke-width="1.6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                />
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `
    }
}