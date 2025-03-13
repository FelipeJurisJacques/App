import Component from "./Component";

export default class Group extends Component {

    public constructor({ children, clipPath }: { children: Component[], clipPath?: string }) {
        super()
        this.children = children
        if (clipPath) {
            this.attributes.set('clip-path', clipPath)
        }
    }

    public get tag(): string {
        return 'g'
    }
}