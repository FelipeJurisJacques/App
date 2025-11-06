export default class Route {
    private paths: string[]
    private render: (documento: Document) => HTMLElement

    public constructor(paths: string[], render: (documento: Document) => HTMLElement) {
        this.paths = paths
        this.render = render
    }

    public checkPath(path: string): boolean {
        return this.paths.includes(path)
    }

    public build(document: Document): HTMLElement {
        return this.render(document)
    }
}