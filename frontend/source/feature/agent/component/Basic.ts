import * as THREE from 'three'

export default class Basic {
    public readonly base: THREE.Group
    private readonly ring1: THREE.Mesh
    private readonly ring2: THREE.Mesh

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
        this.base = new THREE.Group()
        this.base.add(this.ring1)
        this.base.add(this.ring2)
    }
}