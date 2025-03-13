import Component from "./Component"

export default class Svg extends Component {

    constructor({ width, height, viewBox, children }: { width?: number | string, height?: number | string, viewBox?: string, children?: Component[] }) {
        super()
        if (width) {
            this.attributes.set('width', width.toString())
        }
        if (height) {
            this.attributes.set('height', height.toString())
        }
        if (viewBox) {
            this.attributes.set('viewBox', viewBox)
        }
        if (children) {
            this.children = children
        }
    }

    public get tag(): string {
        return 'svg'
    }
}