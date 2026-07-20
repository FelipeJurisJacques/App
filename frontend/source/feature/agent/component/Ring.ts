import * as THREE from 'three'

interface Configuration {
    start: number
    speed: number
    length: number
    radius: number
}

export default class Ring {
    public readonly base: THREE.Mesh
    private readonly configuration: Configuration

    public constructor(configuration: Configuration) {
        this.configuration = configuration
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        })
        let geometry = new THREE.RingGeometry(
            this.configuration.radius, // innerRadius
            this.configuration.radius + 0.05, // outerRadius
            Math.max(
                1,
                Math.trunc(this.configuration.radius * this.configuration.length * 8.0)
            ), // thetaSegments
            1, // phiSegments
            0, // thetaStart
            this.configuration.length // thetaEnd
        )
        this.base = new THREE.Mesh(geometry, material)
        this.base.userData.angle = 0
        this.base.rotation.z = this.configuration.start
    }

    public animate(): void {
        this.base.rotation.z += this.configuration.speed
    }
}