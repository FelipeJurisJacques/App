export default abstract class Element {
    protected dom?: HTMLElement | SVGElement
    private _handlers?: Map<string, Function>

    public abstract get tag(): string

    public abstract render(parent: HTMLElement | SVGElement): void

    public get id(): string {
        return this.dom?.id ?? ''
    }

    public onRender(event: Function): void {
        if (!this._handlers) {
            this._handlers = new Map()
        }
        this._handlers.set('resize', event)
    }
}