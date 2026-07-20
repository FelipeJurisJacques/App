import * as THREE from 'three'
import Scene from './type/Scene'
import SceneDark from './hook/SceneDark'
import SceneLight from './hook/SceneLight'
import SceneHighContrast from './hook/SceneHighContrast'

export default class Agent {
    private annimation: null | Scene = null

    public getScenes(theme: string): THREE.Scene {
        switch (theme) {
            case 'dark':
                if (!this.annimation || !(this.annimation instanceof SceneDark)) {
                    this.annimation = new SceneDark()
                }
                break
            case 'light':
                if (!this.annimation || !(this.annimation instanceof SceneLight)) {
                    this.annimation = new SceneLight()
                }
                break
            default:
                if (!this.annimation || !(this.annimation instanceof SceneHighContrast)) {
                    this.annimation = new SceneHighContrast()
                }
                break
        }
        return this.annimation.scene
    }

    public speak(message: string): void {
        const speak = new SpeechSynthesisUtterance(message)
        speak.rate = 2
        speak.pitch = 1
        speak.volume = 1
        window.speechSynthesis.speak(speak)
    }

    public animate(): void {
        if (this.annimation) {
            this.annimation.animate()
        }
    }
}