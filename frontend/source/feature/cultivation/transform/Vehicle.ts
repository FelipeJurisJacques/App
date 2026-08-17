import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Vehicle {
  public readonly base: THREE.Group

  public constructor() {
    this.base = new THREE.Group()

    const loader = new GLTFLoader()

    // 1 x 1
    loader.load('assets/cultivation/wheel.glb', data => {
      data.scene.rotation.z = Math.PI / 2
      const wheelfl = data.scene
      const wheelfr = data.scene.clone()
      const wheelrl = data.scene.clone()
      const wheelrr = data.scene.clone()

      wheelfl.position.set(-1.5, -0.025, 1.8)
      wheelfr.position.set(1.5, -0.025, 1.8)
      wheelrr.position.set(1.5, 0.15, -1.85)
      wheelrl.position.set(-1.5, 0.15, -1.85)

      wheelfl.scale.set(-1.8, -1.8, -1.8)
      wheelfr.scale.set(1.8, 1.8, 1.8)
      wheelrl.scale.set(-2.2, -2.2, -2.2)
      wheelrr.scale.set(2.2, 2.2, 2.2)

      this.base.add(wheelfl)
      this.base.add(wheelfr)
      this.base.add(wheelrl)
      this.base.add(wheelrr)
    }, event => { }, error => {
      console.error(error)
    })

    // 2.2 x 3.6
    loader.load('assets/cultivation/tractor.glb', data => {
      data.scene.position.y = -0.1
      data.scene.rotation.y = Math.PI
      this.base.add(data.scene)
    }, event => { }, error => {
      console.error(error)
    })
  }

  public update(): void { }
}
