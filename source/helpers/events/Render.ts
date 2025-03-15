import Event from "./Event"
import Component from "../components/Component"

export default class Render extends Event {
    private _target: Component

    public constructor(target: Component) {
        super()
        this._target = target
    }

    public get target(): Component {
        return this._target
    }
}