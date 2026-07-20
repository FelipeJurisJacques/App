import * as THREE from 'three'
import Scene from '../type/Scene'
import Basic from '../component/Basic'

export default class SceneHighContrast implements Scene {
    private readonly basic: Basic
    public readonly scene: THREE.Scene

    public constructor() {
        this.basic = new Basic()
        this.scene = new THREE.Scene()
        this.scene.add(this.basic.base)
    }

    public animate(): void { }
}