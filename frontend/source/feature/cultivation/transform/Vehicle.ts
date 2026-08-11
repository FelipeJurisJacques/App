import * as THREE from 'three'
import Tractor from '../model/Tractor'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Vehicle {
  public readonly base: THREE.Group

  public constructor() {
    this.base = new THREE.Group()
    const tractor = new Tractor()
    this.base.add(tractor.transform)

    const loader = new GLTFLoader()
    loader.load('assets/cultivation/wheel.glb', data => {
      data.scene.rotation.z = Math.PI / 2
      const wheelfl = data.scene
      const wheelfr = data.scene.clone()
      const wheelrl = data.scene.clone()
      const wheelrr = data.scene.clone()

      wheelfl.position.set(-1.2, -0.22, 1.8)
      wheelfr.position.set(1.2, -0.22, 1.8)
      wheelrr.position.set(1.2, -0.08, -1.8)
      wheelrl.position.set(-1.2, -0.08, -1.8)

      wheelfl.scale.set(-1.4, -1.4, -1.4)
      wheelfr.scale.set(1.4, 1.4, 1.4)
      wheelrl.scale.set(-1.7, -1.7, -1.7)
      wheelrr.scale.set(1.7, 1.7, 1.7)

      this.base.add(wheelfl)
      this.base.add(wheelfr)
      this.base.add(wheelrl)
      this.base.add(wheelrr)
    }, event => { }, error => {
      console.error(error)
    })
  }

  public update(): void { }
}
