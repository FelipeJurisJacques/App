import View from './view'
import Stylesheet from '../../stylesheets/main.css'
import CustomShape from '../components/CustomShape'

export default class Main extends View {
    public render(): Element[] {
        const sheet = new CSSStyleSheet()
        sheet.replace(Stylesheet)
        this.shadow.adoptedStyleSheets = [
            sheet,
        ]
        return [
            <custom-shape>
                <p class="top">
                    00:00:00
                </p>
            </custom-shape>
        ]
    }

    public handler(): void {
        const shape = this.shadow.querySelector('custom-shape') as CustomShape
        if (shape) {

            // top
            shape.polygon(() => {
                const path: Array<[number, number]> = []
                path.push([0, 0])
                for (let i = 0; i < 20; i++) {
                    let size = Math.round(1 * (i * 0.3 + 1))
                    let center = shape.width / 2
                    path.push([50 + center + (i * 10 + size + 70), 0])
                    path.push([50 + center + (i * 10 + size + 70 + size), 0])
                    path.push([50 + center + (i * 10 + size + 60 + size), 30])
                    path.push([50 + center + (i * 10 + size + 60), 30])
                    path.push([50 + center + (i * 10 + size + 70), 0])
                    path.push([center - 50 - (i * 10 + size + 70), 0])
                    path.push([center - 50 - (i * 10 + size + 70 + size), 0])
                    path.push([center - 50 - (i * 10 + size + 60 + size), 30])
                    path.push([center - 50 - (i * 10 + size + 60), 30])
                    path.push([center - 50 - (i * 10 + size + 70), 0])
                    path.push([50 + center + (i * 10 + size + 70), 0])
                    path.push([center - 50 - (i * 10 + size + 70), 0])
                    path.push([center - 50 - (i * 10 + size + 70 + size), 0])
                    path.push([center - 50 - (i * 10 + size + 60 + size), 30])
                    path.push([center - 50 - (i * 10 + size + 60), 30])
                    path.push([center - 50 - (i * 10 + size + 70), 0])
                    path.push([center - 50 - (i * 10 + size + 70), 0])
                }
                path.push([0, 0])
                return {
                    color: '#071F1F',
                    points: path,
                }
            })

            // bottom
            shape.polygon(() => {
                const top = shape.height - 50
                const center = shape.width / 2.0
                return {
                    color: '#071F1F',
                    points: [
                        [0, top],
                        [Math.max(center - 230, 10), top],
                        [Math.max(center - 220, 20), top - 10],
                        [center - 50, top - 10],
                        [center - 40, top],
                        [center + 40, top],
                        [center + 50, top - 10],
                        [Math.min(center + 220, shape.width - 20), top - 10],
                        [Math.min(center + 230, shape.width - 10), top],
                        [shape.width, top],
                        // [shape.width, shape.height],
                        // [0, shape.height],
                        // [0, top],
                        [shape.width, top - 2],
                        [Math.min(center + 230, shape.width - 10), top - 2],
                        [Math.min(center + 220, shape.width - 20), top - 12],
                        [center + 50, top - 12],
                        [center + 40, top - 2],
                        [center - 40, top - 2],
                        [center - 50, top - 12],
                        [Math.max(center - 220, 20), top - 12],
                        [Math.max(center - 230, 10), top - 2],
                        [0, top - 2],
                        [0, top],
                    ],
                }
            })
        }
    }
}

window.customElements.define('view-main', Main)