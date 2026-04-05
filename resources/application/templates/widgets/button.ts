import Widget from '../../abstracts/widget'
import Template from '../../helpers/Template'
import Stylesheet from '../../enumeratos/assets/stylesheet'

export default class Button extends Widget {
    protected async build(): Promise<string> {
        return `${await Template.stylesheet(Stylesheet.WIDGET_BUTTON)}<slot></slot>`
    }
}