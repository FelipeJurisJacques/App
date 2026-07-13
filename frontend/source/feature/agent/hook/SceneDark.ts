import * as THREE from 'three'
import Core from '../component/Core'
import Rings from '../component/Rings'
import Particles from '../component/Particles'

export default class SceneDark {
    private readonly core: Core
    private readonly rings: Rings
    public readonly scene: THREE.Scene
    private readonly particles: Particles

    public constructor() {
        this.core = new Core()
        this.rings = new Rings()
        this.scene = new THREE.Scene()
        this.scene.add(this.core.base)
        this.scene.add(this.rings.base)
        this.particles = new Particles()
        this.scene.add(this.particles.base)
    }

    public animate(): void {
        const time = Date.now() * 0.001
        this.particles.animate(time)
        this.core.animate()
        this.rings.animate(time)
    }
}