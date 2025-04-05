import Component from './Component'

export default abstract class Stackable extends Component {
    public get children(): Component[] {
        return []
    }

    public set children(children: Component[]) {
        if (this.dom) {
            for (let child of children) {
                child.render(this.dom)
            }
        }
    }
}