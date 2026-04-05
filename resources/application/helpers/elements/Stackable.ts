import Element from './Element'
import Stylizable from './Stylizable'

export default abstract class Stackable extends Stylizable {
    public get children(): Element[] {
        return []
    }

    public set children(children: Element[]) {
        if (this.dom) {
            // while (this.dom.firstChild) {
            //     this.dom.removeChild(this.dom.firstChild)
            // }
            for (const child of children) {
                child.render(this.dom)
            }
        }
    }
}