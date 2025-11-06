import Widget from '../../abstracts/widget'

export default class Text extends Widget {
    protected async build(): Promise<string> { return '<slot></slot>' }
}