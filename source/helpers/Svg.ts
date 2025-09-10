export default abstract class Svg {
    public static readonly Path = class {
        public static ellipticalArc(
            ray_x: number,
            ray_y: number,
            displacement_x: number,
            displacement_y: number,
            rotation: number = 0,
            large: number = 0,
            clockwise: boolean = true
        ): string {
            return `a${ray_x} ${ray_y} ${rotation} ${large} ${clockwise ? 1 : 0} ${displacement_x} ${displacement_y}`
        }

        public static move(x: number, y: number): string {
            return `M${x} ${y}`
        }

        public static close(): string {
            return 'z'
        }
    }
}