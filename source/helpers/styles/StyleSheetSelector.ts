import StyleSheet from "./StyleSheet"

export default class StyleSheetSelector {
    private _selector: string
    private _declaration: StyleSheet


    public constructor({ tag, style }: { tag: string, style: StyleSheet }) {
        this._selector = tag
        this._declaration = style
    }

    public toString(): string {
        return `${this._selector} {${this._declaration.toString()}}`
    }
}