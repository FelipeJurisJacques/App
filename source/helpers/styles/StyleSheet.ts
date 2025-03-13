export default class StyleSheet {
    private _styles: Map<string, string>

    public constructor() {
        this._styles = new Map()
    }

    public toString(): string {
        let styles = ''
        this._styles.forEach((value, key) => {
            styles += `${key}: ${value};`
        })
        return styles
    }
}