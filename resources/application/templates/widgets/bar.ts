import Widget from '../../abstracts/widget'
import Template from '../../helpers/Template'
import Stylesheet from '../../enumeratos/assets/stylesheet'

export default class Bar extends Widget {
    protected async build(): Promise<string> {
        return `
            ${await Template.stylesheet(Stylesheet.WIDGET_BAR)}
            <slot></slot>
            <div class="bacground">
                <div class="customization"></div>
            </div>
        `
    }
}