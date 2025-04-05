import Type from "./Type"
import Event from "./Event"
import Element from "../elements/Element"

export default class Render implements Event {
    private _target: Element

    public get type(): Type {
        return Type.Render
    }

    public constructor(target: Element) {
        this._target = target
    }

    public get target(): Element {
        return this._target
    }
}