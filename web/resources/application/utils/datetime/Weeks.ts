import Locale from '../../helpers/Locale'

export default class Weeks {
    protected readonly date: Date

    public constructor(date: Date) {
        this.date = date
    }

    public getName(locale: null | string = null): string {
        return this.date.toLocaleDateString(
            locale ? locale : Locale.getLocale(),
            {
                weekday: 'long',
            }
        )
    }

    public getShortName(locale: null | string = null): string {
        return this.date.toLocaleDateString(
            locale ? locale : Locale.getLocale(),
            {
                weekday: 'short',
            }
        )
    }

    public getNarrowName(locale: null | string = null): string {
        return this.date.toLocaleDateString(
            locale ? locale : Locale.getLocale(),
            {
                weekday: 'narrow',
            }
        )
    }

    public toString(): string { return this.getName() }
}