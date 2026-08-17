import * as THREE from "three"

export default class Terriam {
    private readonly size: number
    private readonly repeat: number
    private readonly floor: THREE.Mesh
    private readonly texture: THREE.Texture
    private readonly camera: THREE.PerspectiveCamera

    public get base(): THREE.Mesh {
        return this.floor
    }

    public constructor(camera: THREE.PerspectiveCamera) {
        this.repeat = 100
        this.size = 1024.0
        this.camera = camera
        const loader = new THREE.TextureLoader()
        this.texture = loader.load('assets/cultivation/grass.bmp')
        this.texture.repeat.set(this.repeat, this.repeat)
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.wrapT = THREE.RepeatWrapping
        this.floor = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.size, 1, 1), new THREE.MeshStandardMaterial({
            map: this.texture,
        }))
        this.floor.rotation.x = Math.PI / -2.0
    }

    public update() {
        this.floor.position.x = this.camera.position.x
        this.floor.position.z = this.camera.position.z
        this.texture.offset.x = (this.floor.position.x / this.size) * this.repeat
        this.texture.offset.y = (this.floor.position.z / this.size) * this.repeat * -1.0
    }
}