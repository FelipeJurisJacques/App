import Component from "./Component"

export default class Object extends Component {

    constructor({ data, children }: { data?: string, children?: Component[] }) {
        super()
        if (data) {
            this.attributes = {
                data: data
            }
        }
        this.children = children ? children : []
    }

    public get tag(): string {
        return 'object'
    }
}