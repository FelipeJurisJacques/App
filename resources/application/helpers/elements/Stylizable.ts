import Element from './Element'
import Position from '../../enumeratos/style/Position'

export default abstract class Stylizable extends Element {
    // private _style?: InstanceType<typeof Stylizable.Style>
    private _transform?: InstanceType<typeof Stylizable.Transform>

    public get style(): CSSStyleDeclaration {
        return this.dom!.style
    }

    public get transform(): InstanceType<typeof Stylizable.Transform> {
        if (!this._transform) {
            this._transform = new Stylizable.Transform(this)
        }
        return this._transform
    }

    public static Transform = class {
        private _rect?: DOMRect

        public constructor(element: Stylizable) {
            this._rect = element.dom?.getBoundingClientRect()
        }

        get width(): number {
            return this._rect?.width ?? 0.0
        }

        get height(): number {
            return this._rect?.height ?? 0.0
        }

        get x(): number {
            return this._rect?.x ?? 0.0
        }

        get y(): number {
            return this._rect?.y ?? 0.0
        }

        get top(): number {
            return this._rect?.top ?? 0.0
        }

        get right(): number {
            return this._rect?.right ?? 0.0
        }

        get bottom(): number {
            return this._rect?.bottom ?? 0.0
        }

        get left(): number {
            return this._rect?.left ?? 0.0
        }

        set x(value: number) {
            this._rect!.x = value
        }

        set y(value: number) {
            this._rect!.y = value
        }

        set width(value: number) {
            this._rect!.width = value
        }

        set height(value: number) {
            this._rect!.height = value
        }
    }

    public static Style = class {
        private _style?: CSSStyleDeclaration

        public constructor(element: Stylizable) {
            this._style = element.dom?.style
        }

        public set position(value: Position) {
            this._style!.position = value
        }

        public set top(value: string) {
            this._style!.top = value
        }

        public set right(value: string) {
            this._style!.right = value
        }

        public set bottom(value: string) {
            this._style!.bottom = value
        }

        public set left(value: string) {
            this._style!.left = value
        }

        public set width(value: string) {
            this._style!.width = value
        }

        public set height(value: string) {
            this._style!.height = value
        }
    }
}