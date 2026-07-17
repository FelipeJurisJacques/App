import * as THREE from 'three'
import Core from '../component/Core'
import Rings from '../component/Rings'
import Particles from '../component/Particles'

export default class SceneDark {
    private readonly core: Core
    private readonly rings: Rings
    public readonly scene: THREE.Scene
    private readonly particles1: Particles
    private readonly particles2: Particles
    private readonly particles3: Particles

    public constructor() {
        this.core = new Core()
        this.rings = new Rings()
        this.scene = new THREE.Scene()
        this.scene.add(this.core.base)
        this.scene.add(this.rings.base)
        this.particles1 = new Particles({
            size: 0.015,
            particles: 506,
            noiseScale: 0.2,
            noiseFactor: 0.6,
            radiusInternal: 1.5,
            radiusExternal: 1.7,
        })
        this.particles2 = new Particles({
            angle: 2.0,
            size: 0.015,
            particles: 259,
            noiseScale: 0.2,
            noiseFactor: 0.5,
            radiusInternal: 1.5,
            radiusExternal: 1.7,
        })
        this.particles3 = new Particles({
            size: 0.05,
            delta: 0.3,
            particles: 116,
            noiseScale: 0.5,
            coronastar: true,
            noiseFactor: 0.4,
            radiusInternal: 1.5,
            radiusExternal: 1.7,
        })
        this.scene.add(this.particles1.base)
        this.scene.add(this.particles2.base)
        this.scene.add(this.particles3.base)
    }

    public animate(): void {
        const time = Date.now() * 0.001
        this.particles1.animate(time)
        this.particles2.animate(time)
        this.particles3.animate(time)
        this.core.animate()
        this.rings.animate(time)
    }
}