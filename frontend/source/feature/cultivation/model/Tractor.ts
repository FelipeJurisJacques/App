import * as THREE from "three";

export default class Tractor {
  public readonly transform: THREE.Group;

  public constructor() {
    this.transform = new THREE.Group();
    this.cabin()
    this.chassi();
  }

  private cabin(): void {
    const material = new THREE.MeshBasicMaterial({ color: 0xcc5555 });
    const cabin0 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 3.0), material)
    cabin0.position.y = 0.7
    cabin0.position.z = 0.7
    this.transform.add(cabin0);
    const cabin1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 1.8), material)
    cabin1.position.y = 1.5
    cabin1.position.z = -1.5
    this.transform.add(cabin1);
  }

  private chassi(): void {
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const chassi = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 4.3), material)
    this.transform.add(chassi);
    const axle0 = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.2, 0.2),
      material,
    );
    axle0.position.z = 1.8;
    axle0.position.y = -0.2;
    this.transform.add(axle0);
    const axle1 = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.2, 0.2),
      material,
    );
    axle1.position.y = 0.1;
    axle1.position.z = -1.8;
    this.transform.add(axle1);
  }
}
