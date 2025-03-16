import Svg from "../elements/Svg"
import StyleSheet from "./StyleSheet"
import Group from "../elements/Group"
import Element from "../elements/Element"
import Vector2 from "../../utils/Vector2"
import Polygon from "../elements/Polygon"
import ClipPath from "../elements/ClipPath"

export default class VectorialScalable extends StyleSheet {
    private element: Svg
    private index: number

    public constructor(width: number, height: number) {
        super()
        this.index = 0
        this.element = new Svg({
            width: width,
            height: height,
            viewBox: `0 0 ${width} ${height}`,
        })
    }

    public addPolygon(paths: Vector2[] | Vector2[][], color: string): void {
        if (paths.length === 0) {
            return
        }
        const values: string[] = []
        if (Array.isArray(paths[0])) {
            for (const item of paths as Vector2[][]) {
                let points = ''
                for (const point of item) {
                    points += `${point.x} ${point.y} `
                }
                values.push(points.trimEnd())
            }
        } else {
            let points = ''
            for (const point of paths as Vector2[]) {
                points += `${point.x} ${point.y} `
            }
            values.push(points.trimEnd())
        }
        if (values.length > 0) {
            this.element.children.push(this.createPolygon(values, color))
        }
    }

    public write(style: InstanceType<typeof Element.Style>): void {
        style.backgroundImage = this.toString()
        style.backgroundSize = 'cover'
        style.backgroundPosition = 'center'
        style.backgroundRepeat = 'no-repeat'
    }

    public toString(): string {
        return `url('data:image/svg+xml,${encodeURIComponent(this.element.toString())}')`
    }

    private createClipPath(id: string, path: string): ClipPath {
        return new ClipPath({
            id: id,
            children: [
                new Polygon({
                    points: path,
                }),
            ],
        })
    }

    private createPolygon(paths: string[], color: string): Polygon {
        {
            if (paths.length == 0) {
                throw new Error('No paths provided')
            } else if (paths.length == 1) {
                return new Polygon({
                    color: color,
                    points: paths[0],
                })
            } else {
                const id = `clip${this.index++}`
                this.element.children.push(this.createClipPath(id, paths[0]))
                if (paths.length == 2) {
                    return new Polygon({
                        color: color,
                        points: paths[1],
                        clipPath: `url(#${id})`,
                    })
                } else {
                    return new Group({
                        clipPath: `url(#${id})`,
                        children: [
                            this.createPolygon(paths.slice(1), color),
                        ],
                    })
                }
            }
        }
    }
}