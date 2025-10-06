import Listener from '../helpers/listener'

export default abstract class View {
    private node: HTMLElement

    public constructor(view: HTMLElement) {
        this.node = view
    }

    public get element(): HTMLElement {
        return this.node
    }

    public abstract handler(): void
    public abstract render(): string
    public abstract destroy(): void

    protected listen(selector: string): Listener {
        return Listener.listen(selector)
    }
}