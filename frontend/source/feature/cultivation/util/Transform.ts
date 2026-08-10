import Vector3 from "../type/Vector3";
import Geolocation from "../type/Geolocation";

export default class Transform {
    private angle: Vector3
    private position: Vector3
    private initial: Geolocation
    private queue: Array<Vector3>
    private processing: Geolocation

    public constructor() {
        this.queue = []
        this.angle = {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        }
        this.position = {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        }
        this.initial = {
            altitude: 0.0,
            latitude: 0.0,
            longitude: 0.0,
        }
        this.processing = {
            altitude: 0.0,
            latitude: 0.0,
            longitude: 0.0,
        }
    }

    public getAngle(): Vector3 {
        return this.angle
    }

    public getPosition(): Vector3 {
        return this.position
    }

    public pushGeolocation(geolocation: Geolocation): void {
        if (
            this.initial.altitude === 0.0
            && this.initial.latitude === 0.0
            && this.initial.longitude === 0.0
        ) {
            this.initial = geolocation
        } else if (geolocation !== this.processing) {
            this.processing = geolocation
        }
    }

    public update(): void {
        if (this.queue.length) {
            const position = this.queue.pop()
            if (position) {
                this.position = position
            }
        }
    }
}