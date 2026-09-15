import { UrlEnum, UrlEnumValue } from '../definitions/types'

export default class Template {
    public static async content<T extends UrlEnum>(asset: UrlEnumValue<T>): Promise<string> {
        const response = await fetch(asset)
        return await response.text()
    }

    public static async stylesheet<T extends UrlEnum>(asset: UrlEnumValue<T>): Promise<string> {
        return `<style>${await Template.content(asset)}</style>`
    }
}