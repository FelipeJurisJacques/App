import Component from "./Component";

export default class Canvas extends Component {

    public constructor({ width, height }: { width: number, height: number }) {
        super()
        this.attributes.set('width', width.toString())
        this.attributes.set('height', height.toString())
    }

    public get tag(): string {
        return 'canvas'
    }
}