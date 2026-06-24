import Weeks from './Weeks'

export default class Week extends Weeks {
    public getDay(): number { return 1 + this.date.getDay() }
}