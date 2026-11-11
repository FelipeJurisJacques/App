import * as THREE from "three"

export default interface Scene {
    animate(): void;
    intensity: number;
    scene: THREE.Scene;
}