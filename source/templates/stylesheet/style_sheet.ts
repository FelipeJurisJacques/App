export default class StyleSheet extends CSSStyleSheet {

    public get length(): number {
        return super.cssRules.length
    }

    public get rules(): CSSRuleList {
        return super.cssRules
    }

    public pushRule(value: string): void {
        super.insertRule(value)
    }

    public toString(): string {
        let css = ''
        const rules = this.rules
        for (let i = 0; i < rules.length; i++) {
            css += `\r\n${rules.item(i)?.cssText}`
        }
        return css
    }
}