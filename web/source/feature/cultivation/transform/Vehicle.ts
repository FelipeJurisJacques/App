import * as THREE from 'three'
import Transform from '../util/Transform'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Vehicle {
  public readonly base: THREE.Group
  private readonly transform: Transform

  public constructor(transform: Transform) {
    this.transform = transform
    this.base = new THREE.Group()

    const loader = new GLTFLoader()

    // 1 x 1
    loader.load('assets/cultivation/wheel.glb', data => {
      data.scene.rotation.z = Math.PI / 2
      const wheelfl = data.scene
      const wheelfr = data.scene.clone()
      const wheelrl = data.scene.clone()
      const wheelrr = data.scene.clone()

      wheelfl.position.set(-1.5, 0.775, 1.8)
      wheelfr.position.set(1.5, 0.775, 1.8)
      wheelrr.position.set(1.5, 1.0, -1.85)
      wheelrl.position.set(-1.5, 1.0, -1.85)

      wheelfl.scale.set(-1.8, -1.8, -1.8)
      wheelfr.scale.set(1.8, 1.8, 1.8)
      wheelrl.scale.set(-2.2, -2.2, -2.2)
      wheelrr.scale.set(2.2, 2.2, 2.2)

      this.base.add(wheelfl)
      this.base.add(wheelfr)
      this.base.add(wheelrl)
      this.base.add(wheelrr)
    }, () => { }, error => {
      console.error(error)
    })

    // 2.2 x 3.6
    loader.load('assets/cultivation/tractor.glb', data => {
      data.scene.position.y = 0.75
      data.scene.rotation.y = Math.PI
      this.base.add(data.scene)
    }, () => { }, error => {
      console.error(error)
    })
  }

  public update(): void {
    const position = this.transform.position
    const rotation = this.transform.rotation
    this.base.position.set(position.x, position.y, position.z)
    this.base.rotation.set(rotation.x, rotation.y, rotation.z)
  }
}
