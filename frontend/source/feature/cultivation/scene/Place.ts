import * as THREE from "three";
import Vehicle from "../transform/Vehicle";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Place {
  public readonly scene: THREE.Scene;
  private readonly vehicle: Vehicle;
  private readonly controls: OrbitControls;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera: THREE.PerspectiveCamera;

  public constructor(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.vehicle = new Vehicle();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.dampingFactor = 0.05;
    this.controls.enableDamping = true;
    this.controls.screenSpacePanning = false;
    this.scene.add(this.vehicle.base);
  }

  public update(): void {
    this.vehicle.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera)
  }
}
