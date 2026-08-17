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
        this.texture = this.createGrassTexture()
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

    private createGrassTexture(): THREE.CanvasTexture {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#4FBF4F'
        ctx.fillRect(0, 0, 256, 256)
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 256
            const y = Math.random() * 256
            const alpha = Math.random() * 0.3
            const green = Math.floor(100 + Math.random() * 80)
            ctx.fillStyle = `rgba(35, ${green}, 30, ${alpha})`
            ctx.fillRect(x, y, 2, 4)
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        return texture;
    }
}