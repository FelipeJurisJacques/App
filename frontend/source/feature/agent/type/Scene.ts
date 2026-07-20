import * as THREE from 'three'

export default interface Scene {
    scene: THREE.Scene
    animate(): void
}