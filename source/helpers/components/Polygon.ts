import Component from "./Component";

export default class Polygon extends Component {

    constructor({ color, points, clipPath }: { color?: string, points: string, clipPath?: string }) {
        super()
        if (color) {
            this.attributes.set('fill', color)
        }
        if (points) {
            this.attributes.set('points', points)
        }
        if (clipPath) {
            this.attributes.set('clip-path', clipPath)
        }
    }

    public get tag(): string {
        return 'polygon'
    }
}