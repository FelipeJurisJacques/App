import * as THREE from "three"
import Grass from "../transform/Grass"
import Vehicle from "../transform/Vehicle"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default class Place {
  private readonly vehicle: Vehicle
  private readonly floor: THREE.Mesh
  public readonly scene: THREE.Scene
  private readonly grases: Array<Grass>
  private readonly controls: OrbitControls
  private readonly renderer: THREE.WebGLRenderer
  private readonly camera: THREE.PerspectiveCamera

  public constructor(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ) {
    this.camera = camera
    this.renderer = renderer
    this.scene = new THREE.Scene()
    this.vehicle = new Vehicle()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.dampingFactor = 0.05
    this.controls.enableDamping = true
    this.controls.screenSpacePanning = false
    this.scene.add(this.vehicle.base)
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(callback => {
        console.log(`${callback.coords.latitude}, ${callback.coords.longitude}, ${callback.coords.altitude}`)
      }, error => {
        console.error(error)
      })
    }
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(1024.0, 1024.0, 1, 1), new THREE.MeshBasicMaterial({
      color: 0xaaffaa,
    }))
    this.vehicle.base.position.y = 0.85
    this.floor.rotation.x = Math.PI / -2.0
    this.scene.add(this.floor)
    this.grases = [new Grass()]
    for (let grass of this.grases) {
      this.scene.add(grass.base)
    }
  }

  public update(): void {
    this.vehicle.update()
    this.controls.update()
    this.floor.position.x = this.camera.position.x
    this.floor.position.z = this.camera.position.z
    this.renderer.render(this.scene, this.camera)
  }
}
