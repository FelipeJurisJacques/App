import Widget from '../../abstracts/widget'
import Template from '../../helpers/Template'
import Stylesheet from '../../enumeratos/assets/stylesheet'

export default class Top extends Widget {
    protected async build(): Promise<string> {
        const path = []
        const positions = [
            '50% -',
            '50% +',
        ]
        path.push(`0px 0px`)
        for (let i = 0; i < 20; i++) {
            let size = Math.round(1 * (i * 0.3 + 1))
            for (let position of positions) {
                path.push(`calc(${position} ${i * 10 + size + 70}px) 0px`)
                path.push(`calc(${position} ${i * 10 + size + 70 + size}px) 0px`)
                path.push(`calc(${position} ${i * 10 + size + 60 + size}px) 30px`)
                path.push(`calc(${position} ${i * 10 + size + 60}px) 30px`)
                path.push(`calc(${position} ${i * 10 + size + 70}px) 0px`)
            }
        }
        path.push(`0px 0px`)
        return `
            <style>
                ${await Template.content(Stylesheet.WIDGET_TOP)}
                div.bacground {
                    clip-path: polygon(${path.join(', ')});
                }
            </style>
            <div class="content">
                <slot></slot>
            </div>
            <div class="bacground"></div>
        `
    }
}