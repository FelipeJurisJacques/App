import Middleware from "../../midlewares/Middleware"

export default abstract class Element {
    protected dom?: HTMLElement | SVGElement
    private _handler?: InstanceType<typeof Element.Handler>

    public abstract get tag(): string

    public render(parent: HTMLElement | SVGElement): void {
        if (this._handler) {
        }
    }

    public get id(): string {
        return this.dom!.id ?? ''
    }

    public get handler(): InstanceType<typeof Element.Handler> {
        if (!this._handler) {
            this._handler = new Element.Handler()
        }
        return this._handler
    }

    public static Handler = class extends Middleware<Element> {
        protected dispatch(element: Element): void {
            // super.dispatch(element)
        }
    }
}