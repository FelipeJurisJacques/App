import Core from './vfx/Core'
import * as THREE from 'three'
import Basic from './vfx/Basic'
import Rings from './vfx/Rings'
import Particles from './vfx/Particles'

export default class Agent {
    private readonly core: Core
    private readonly basic: Basic
    private readonly rings: Rings
    private readonly particles: Particles
    private readonly scenesDark: THREE.Scene[]
    private readonly scenesLight: THREE.Scene[]

    public constructor() {
        this.core = new Core()
        this.basic = new Basic()
        this.rings = new Rings()
        this.particles = new Particles()
        this.scenesDark = [
            this.core.getScene(),
            this.rings.getScene(),
            this.particles.getScene(),
        ]
        this.scenesLight = [
            this.basic.getScene(),
        ]
    }

    public getScenes(): THREE.Scene[] {
        const theme = window.document.documentElement.style.getPropertyValue('--theme')
        if (theme === 'dark') {
            return this.scenesDark
        } else {
            return this.scenesLight
        }
    }

    public speak(message: string): void {
        const speak = new SpeechSynthesisUtterance(message)
        speak.rate = 2
        speak.pitch = 1
        speak.volume = 1
        window.speechSynthesis.speak(speak)
    }

    public animate(): void {
        const theme = window.document.documentElement.style.getPropertyValue('--theme')
        if (theme === 'dark') {
            const time = Date.now() * 0.001
            this.particles.animate(time)
            this.core.animate()
            this.rings.animate(time)
        }
    }
}