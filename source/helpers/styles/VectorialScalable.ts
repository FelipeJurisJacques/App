import Vector2 from '../../utils/Vector2'
import StyleSheet from './StyleSheet'

export default class VectorialScalable extends StyleSheet {
    private index: number
    private width: number
    private height: number
    private elements: string[]

    public constructor(width: number, height: number) {
        super()
        this.index = 0
        this.elements = []
        this.width = width
        this.height = height
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
            this.elements.push(this.createPolygon(values, color))
        }
    }

    private createClipPath(id: string, path: string): string {
        return `<clipPath id="${id}"><polygon points="${path}" /></clipPath>`
    }

    // public write(style: InstanceType<typeof Element.Style>): void {
    //     style.backgroundImage = this.toString()
    //     style.backgroundSize = 'cover'
    //     style.backgroundPosition = 'center'
    //     style.backgroundRepeat = 'no-repeat'
    // }

    public toString(): string {
        let svg = `<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">`
        svg += this.elements.join('')
        svg += '</svg>'
        console.log(svg)
        return svg
        const data = `url('data:image/svg+xml,${encodeURIComponent(svg)}')`
        const style = `background-image: ${data}; background-size: cover; background-position: center; background-repeat: no-repeat;`
        return style
    }

    private createPolygon(paths: string[], color: string): string {
        if (paths.length == 0) {
            throw new Error('No paths provided')
        }
        if (paths.length == 1) {
            return `<polygon points="${paths[0]}" fill="${color}" />`
        }
        const id = `clip${this.index++}`
        this.elements.push(this.createClipPath(id, paths[0]))
        if (paths.length == 2) {
            return `<polygon points="${paths[1]}" fill="${color}" clip-path="url(#${id})" />`
        }
        return `<g clip-path="url(#${id})">${this.createPolygon(paths.slice(1), color)}</g>`
    }
}