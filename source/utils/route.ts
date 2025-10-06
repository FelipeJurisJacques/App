import View from './view'

export default class Route {
    private builder: typeof View
    private compatible: string[]

    public constructor(view: typeof View, paths: string[]) {
        if (view === View || Object.getPrototypeOf(view) !== View) {
            throw new Error('Invalid view class')
        } else {
            this.builder = view
            this.compatible = paths
        }
    }

    public get view(): typeof View {
        return this.builder
    }

    public get paths(): string[] {
        return this.compatible
    }

    public build(): View {
        const view = this.builder as any
        window.document.querySelectorAll('widget-view').forEach(element => element.remove())
        const element = window.document.createElement('widget-view')
        window.document.body.appendChild(element)
        const instance = new view(element)
        element.innerHTML = instance.render()
        instance.handler()
        return instance
    }
}