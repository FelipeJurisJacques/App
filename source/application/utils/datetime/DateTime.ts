import Week from './Week'
import Weeks from './Weeks'

export default class DateTime {
    private readonly date: Date

    public static now(): DateTime { return new DateTime(new Date()) }

    public static getWeeks(): Weeks[] {
        const result = []
        for (let i = 0; i < 16; i++) {
            let date = new Date()
            date.setDate(i)
            if (result.length === 7) {
                break
            } else if (result.length === date.getDay()) {
                result.push(new Weeks(date))
            }
        }
        return result
    }

    private constructor(date: Date) { this.date = date }

    public getWeek(): Week { return new Week(this.date) }
}