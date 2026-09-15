import * as THREE from 'three'
import Scene from '../type/Scene'
import Core from '../component/Core'
import Ring from '../component/Ring'

export default class SceneLight implements Scene {
    private readonly core: Core
    public readonly scene: THREE.Scene
    private readonly rings: Array<Ring>

    public constructor() {
        this.rings = []
        this.core = new Core({
            particles: false,
            rotationX: 0.001,
            collor: 0x002222,
            rotationY: 0.0005,
        })
        for (let radius = 0.8; radius < 2.0; radius += 0.025) {
            this.rings.push(new Ring({
                width: 0.01,
                radius: radius,
                collor: 0x00aaaa,
                speed: (Math.random() - 0.5) * 0.01,
                start: Math.random() * Math.PI * 2.0,
                length: Math.max(Math.PI / 6, Math.random() * Math.PI),
            }))
        }
        this.scene = new THREE.Scene()
        this.scene.add(this.core.base)
        for (let instance of this.rings) {
            this.scene.add(instance.base)
        }
    }

    public animate(): void {
        this.core.animate()
        for (let instance of this.rings) {
            instance.animate()
        }
    }
}
