export default abstract class Component {
    protected dom?: HTMLElement

    public abstract build(parent: HTMLElement): void
}