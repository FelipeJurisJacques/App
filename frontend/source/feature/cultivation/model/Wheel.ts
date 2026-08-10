import * as THREE from "three";

export default class Wheel {
  public readonly transform: THREE.Group;

  public constructor(radius: number) {
    this.transform = new THREE.Group();

    const externalFormat = new THREE.Shape();
    externalFormat.absarc(0, 0, radius, 0, Math.PI * 2, false);
    const internalFormat = new THREE.Path();
    internalFormat.absarc(0, 0, radius * 0.7, 0, Math.PI * 2, true);
    externalFormat.holes.push(internalFormat);
    const geometry = new THREE.ExtrudeGeometry(externalFormat, {
      curveSegments: 8,
      depth: radius * 0.7,
      bevelEnabled: false,
    });
    const tire = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x222222 }),
    );
    geometry.center();
    tire.rotation.z = Math.PI / 2;
    tire.rotation.y = Math.PI / 2;
    this.transform.add(tire);

    const hubcap = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, radius * 0.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xcccccc }),
    );
    hubcap.rotation.z = Math.PI / 2;
    this.transform.add(hubcap);
  }
}
