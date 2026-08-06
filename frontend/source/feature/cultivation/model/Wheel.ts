import * as THREE from "three";

export default class Wheel {
  public readonly transform: THREE.Group;

  public constructor(radius: number) {
    this.transform = new THREE.Group();

    const material0 = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, radius * 0.7, 32),
      material0,
    );
    tire.rotation.z = Math.PI / 2;
    this.transform.add(tire);

    const material1 = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const hubcap = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, radius * 0.71, 16),
      material1,
    );
    hubcap.rotation.z = Math.PI / 2;
    this.transform.add(hubcap);
  }
}
