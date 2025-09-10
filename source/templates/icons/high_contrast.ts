import Svg from '../../helpers/Svg'

export default class HighContrast extends HTMLElement {
    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        const width = this.getAttribute('width') ?? '30'
        const height = this.getAttribute('height') ?? '30'
        const path = `${Svg.Path.move(12, 5)}${Svg.Path.ellipticalArc(1, 1, 0, 14)}${Svg.Path.close()}`
        shadow.innerHTML = `
            <svg
                width="${width}"
                height="${height}"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="9" fill="black"/>
                <path d="${path}" fill="white"/>
            </svg>
        `
    }
}