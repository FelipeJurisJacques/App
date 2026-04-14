import Core from './vfx/Core'
import * as THREE from 'three'
import Rings from './vfx/Rings'
import Particles from './vfx/Particles'

export default class Agent {
    private readonly core: Core
    private readonly rings: Rings
    private readonly particles: Particles
    private readonly scenes: THREE.Scene[]

    public constructor() {
        this.core = new Core()
        this.particles = new Particles()
        this.rings = new Rings()
        this.scenes = [
            this.core.getScene(),
            this.rings.getScene(),
            this.particles.getScene(),
        ]
    }

    public getScenes(): THREE.Scene[] {
        return this.scenes
    }

    public speak(message: string): void {
        const speak = new SpeechSynthesisUtterance(message)
        speak.rate = 2
        speak.pitch = 1
        speak.volume = 1
        window.speechSynthesis.speak(speak)
    }

    public animate(): void {
        const time = Date.now() * 0.001
        this.particles.animate(time)
        this.core.animate()
        this.rings.animate(time)
    }
}