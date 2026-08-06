import * as THREE from "three";

export default class Tractor {
  public readonly transform: THREE.Group;

  public constructor() {
    this.transform = new THREE.Group();
    this.chassi();
  }

  private chassi(): void {
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.transform.add(
      new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 4.0), material),
    );
    const axle0 = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.2, 0.2),
      material,
    );
    axle0.position.z = 1.8;
    axle0.position.y = -0.2;
    this.transform.add(axle0);
    const axle1 = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.2, 0.2),
      material,
    );
    axle1.position.y = 0.1;
    axle1.position.z = -1.8;
    this.transform.add(axle1);
  }
}
