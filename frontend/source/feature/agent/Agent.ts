import * as THREE from 'three'
import SceneDark from './hook/SceneDark'
import SceneLight from './hook/SceneLight'

export default class Agent {
    private dark: null | SceneDark = null
    private light: null | SceneLight = null

    public getScenes(theme: string): THREE.Scene {
        if (theme === 'dark') {
            if (!this.dark) {
                this.light = null
                this.dark = new SceneDark()
            }
            return this.dark.scene
        } else {
            if (!this.light) {
                this.dark = null
                this.light = new SceneLight()
            }
            return this.light.scene
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
        if (this.dark) {
            this.dark.animate()
        }
    }
}