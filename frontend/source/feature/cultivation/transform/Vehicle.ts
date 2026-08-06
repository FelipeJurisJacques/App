import * as THREE from "three";
import Wheel from "../model/Wheel";
import Tractor from "../model/Tractor";

export default class Vehicle {
  public readonly base: THREE.Group;

  public constructor() {
    this.base = new THREE.Group();
    const tractor = new Tractor();
    this.base.add(tractor.transform);

    const wheelfl = new Wheel(0.7);
    wheelfl.transform.position.z = 1.8;
    wheelfl.transform.position.x = -1.0;
    wheelfl.transform.position.y = -0.2;
    this.base.add(wheelfl.transform);

    const wheelfr = new Wheel(0.7);
    wheelfr.transform.position.z = 1.8;
    wheelfr.transform.position.x = 1.0;
    wheelfr.transform.position.y = -0.2;
    this.base.add(wheelfr.transform);

    const wheelrl = new Wheel(1.0);
    wheelrl.transform.position.z = -1.8;
    wheelrl.transform.position.x = -1.0;
    wheelrl.transform.position.y = 0.1;
    this.base.add(wheelrl.transform);

    const wheelrr = new Wheel(1.0);
    wheelrr.transform.position.z = -1.8;
    wheelrr.transform.position.x = 1.0;
    wheelrr.transform.position.y = 0.1;
    this.base.add(wheelrr.transform);
  }

  public update(): void {}
}
