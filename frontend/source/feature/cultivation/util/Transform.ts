import Vector3 from "../type/Vector3"
import Geolocation from "../type/Geolocation"

export default class Transform {
    private angle: number
    private transform: Vector3
    private initial: Geolocation
    private queue: Array<Vector3>
    private processing: Geolocation

    public get rotation(): Vector3 {
        return {
            x: 0.0,
            y: this.angle,
            z: 0.0,
        }
    }

    public get position(): Vector3 {
        return this.transform
    }

    public get geolocation(): Geolocation {
        return this.processing
    }

    public set geolocation(geolocation: Geolocation) {
        if (
            this.initial.altitude === 0.0
            && this.initial.latitude === 0.0
            && this.initial.longitude === 0.0
        ) {
            this.initial = geolocation
            this.processing = geolocation
        } else if (geolocation !== this.processing) {
            this.processing = geolocation
        }
    }

    public constructor() {
        this.queue = []
        this.angle = 0.0
        this.transform = {
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

    public update(): void {
        if (this.initial !== this.processing) {
            const diference = {
                altitude: this.processing.altitude - this.initial.altitude,
                latitude: this.processing.latitude - this.initial.latitude,
                longitude: this.processing.longitude - this.initial.longitude,
            } as Geolocation
            if (this.queue.length) {
                const position = this.queue.pop()
                if (position) {
                    this.transform = position
                }
            }
        }
    }
}