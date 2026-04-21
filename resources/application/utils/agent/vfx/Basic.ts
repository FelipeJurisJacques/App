import * as THREE from 'three'

export default class Basic {
    private readonly ring1: THREE.Mesh
    private readonly ring2: THREE.Mesh
    private readonly scene: THREE.Scene

    public constructor() {
        this.ring1 = new THREE.Mesh(new THREE.RingGeometry(
            0.8, // innerRadius
            1.0, // outerRadius
            64, // thetaSegments
            1, // phiSegments
            0, // thetaStart
            Math.PI * 2.0 // thetaEnd
        ), new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        }))
        this.ring2 = new THREE.Mesh(new THREE.RingGeometry(
            1.0, // innerRadius
            1.2, // outerRadius
            64, // thetaSegments
            1, // phiSegments
            0, // thetaStart
            Math.PI * 2.0 // thetaEnd
        ), new THREE.MeshBasicMaterial({
            color: 0xdddddd,
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        }))
        this.scene = new THREE.Scene()
        this.scene.add(this.ring1)
        this.scene.add(this.ring2)
    }

    public getScene(): THREE.Scene {
        return this.scene
    }

    public animate(): void {
    }
}