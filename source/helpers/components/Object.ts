import Component from "./Component"

export default class Object extends Component {

    constructor({ data, children, onRender }: { data?: string, children?: Component[], onRender?: Function }) {
        super()
        if (data) {
            this.attributes.set('data', data)
        }
        if (children) {
            this.children = children
        }
        if (onRender) {
            this.handlers.set('render', onRender)
        }
    }

    public get data(): string|null {
        const value = this.attributes.get('data')
        return value ? value : null
    }

    public set data(value: string) {
        this.attributes.set('data', value)
    }

    public get tag(): string {
        return 'object'
    }
}