import * as THREE from "three"
import Transform from "../util/Transform"
import Terriam from "../transform/Terriam"
import Vehicle from "../transform/Vehicle"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default class Place {
  private readonly terriam: Terriam
  private readonly vehicle: Vehicle
  public readonly scene: THREE.Scene
  public readonly transform: Transform
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
    this.transform = new Transform()
    this.terriam = new Terriam(this.camera)
    this.vehicle = new Vehicle(this.transform)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.dampingFactor = 0.05
    this.controls.enableDamping = true
    this.controls.screenSpacePanning = false
    this.scene.add(this.vehicle.base)
    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(ambient)
    this.scene.add(this.terriam.base)
  }

  public update(): void {
    this.vehicle.update()
    this.terriam.update()
    this.controls.update()
    this.transform.update()
    this.renderer.render(this.scene, this.camera)
  }
}
