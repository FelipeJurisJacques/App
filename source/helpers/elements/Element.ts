export default abstract class Element {
    protected dom?: HTMLElement | SVGElement

    public abstract get tag(): string

    public abstract render(parent: HTMLElement | SVGElement): void

    public get id(): string {
        return this.dom!.id ?? ''
    }
}