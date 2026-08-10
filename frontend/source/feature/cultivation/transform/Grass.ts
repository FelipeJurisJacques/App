import * as THREE from 'three'

export default class Grass {
    public readonly base: THREE.Group

    public constructor() {
        this.base = new THREE.Group()
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        })
        for (let i = 0; i < 12; i++) {
            const grass = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 3), material)
            grass.position.y = 0.05
            grass.position.x = 2.0 * (Math.random() - 0.5)
            grass.position.z = 2.0 * (Math.random() - 0.5)
            this.base.add(grass)
        }
    }
}