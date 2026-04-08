import * as THREE from 'three'

export default class Agent {
    private n: number
    private l1: number
    private l2: number
    private ray: number
    private left: number
    private right: number
    private delta: number
    private scene: THREE.Scene
    private offset: number
    private intensity: number
    private points_depth: number
    private points_length: number
    private points_geometry: THREE.BufferGeometry
    private ring_transforms: THREE.Points[]

    public constructor() {
        this.ray = 0.5
        const length = Math.round(512 * this.ray)
        this.n = 1
        this.l1 = length / 5
        this.l2 = length / 7
        this.left = 0
        this.right = 0
        this.delta = 0.0
        this.scene = new THREE.Scene()
        this.offset = 0.0
        this.intensity = 0.0
        this.points_depth = Math.round(16 * this.ray)
        this.points_length = length
        this.ring_transforms = []

        const gridHelper = new THREE.GridHelper(10, 10)
        gridHelper.rotation.x = Math.PI / 2
        this.scene.add(gridHelper)

        const ambientLight = new THREE.AmbientLight(0xffffff, 5)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5)
        directionalLight1.position.set(1, 0, 1)
        this.scene.add(directionalLight1)
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5)
        directionalLight2.position.set(-1, 0, -1)
        this.scene.add(directionalLight2)

        const geometry = new THREE.BufferGeometry()
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.001 + Math.random() * 0.003,
            sizeAttenuation: true
        })
        const vertices = []
        for (let i = 0; i < this.points_length * this.points_depth; i++) {
            vertices.push(0.0, 0.0, 0.0)
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        const points = new THREE.Points(geometry, material)
        this.scene.add(points)
        this.points_geometry = geometry

        const ring_geometry = new THREE.RingGeometry(
            0.3,
            0.4,
            64,
            10,
            Math.PI / 2,
            Math.PI * 2
        )
        const ring_material = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 0.005,
            sizeAttenuation: true
        })
        const ring = new THREE.Points(ring_geometry, ring_material)
        this.ring_transforms.push(ring)
        this.scene.add(ring)
    }

    public get Scene(): THREE.Scene {
        return this.scene
    }

    public animate(): void {
        const startLeft = this.left
        const startRight = this.right

        this.animateWave()

        const endLeft = this.left
        const endRight = this.right

        this.left = startLeft
        this.right = startRight
        this.animateRing()

        this.left = endLeft
        this.right = endRight

        this.delta += (this.intensity - this.delta) * 0.2
    }

    public speak(message: string): void {
        const speak = new SpeechSynthesisUtterance(message)
        speak.rate = 2
        speak.pitch = 1
        speak.volume = 1
        window.speechSynthesis.speak(speak)
        this.speaking(
            message.toLocaleLowerCase(),
            0,
            100 / speak.rate,
        )
    }

    private speaking(message: string, index: number, rate: number): void {
        let time = rate
        const char = message.at(index)
        if (char === ' ') {
            this.intensity = 0.0
        } else if (
            char === '.'
            || char === '?'
            || char === '!'
            || char === ','
            || char === ';'
            || char === ':'
        ) {
            time *= 2
            this.intensity = 0.0
        } else if (
            char === 'a'
            || char === 'e'
            || char === 'i'
            || char === 'o'
            || char === 'u'
        ) {
            this.intensity = 1.0
        } else {
            this.intensity = 0.5
        }
        if (index > message.length) {
            this.intensity = 0.0
        } else {
            setTimeout(() => {
                this.speaking(message, index + 1, rate)
            }, time)
        }
    }

    private animateRing(): void {
        const ring = this.ring_transforms[0]
        if (!ring) return

        const position = ring.geometry.attributes.position
        const segments = 64
        const layers = 11 // phiSegments + 1
        
        const startLeft = this.left
        const startRight = this.right
        const columns = this.points_length / this.points_depth

        for (let j = 0; j <= segments; j++) {
            const angle = Math.PI / 2 + (j / segments) * Math.PI * 2
            const colOffset = (j / segments) * columns
            const curLeft = startLeft - colOffset
            const curRight = startRight + colOffset
            
            for (let l = 0; l < layers; l++) {
                const index = l * (segments + 1) + j
                const radius = 0.3 + (l / (layers - 1)) * 0.1
                const offset = this.calculateWave(l * (this.points_depth / (layers - 1)), curLeft, curRight)
                
                position.setXY(index, Math.cos(angle) * offset * radius, Math.sin(angle) * offset * radius)
            }
        }
        position.needsUpdate = true
    }

    private calculateWave(y: number, left: number, right: number): number {
        const angle = Math.PI / 2
        const external = this.fourierSeries(left, this.l1)
        const internal = this.fourierSeries(right, this.l2)
        const balance = y / this.points_depth
        const sin = Math.sin(balance * angle)
        const cos = Math.sin((1.0 - balance) * angle)
        return (external * sin + internal * cos + 1.0)
    }

    private vertical(position: any, indexes: number[], angle: number): void {
        const vertex = new THREE.Vector3()
        let i = 0
        for (let index of indexes) {
            const offset = this.calculateWave(i++, this.left, this.right)
            vertex.fromBufferAttribute(position, index)
            vertex.set(
                Math.cos(angle) * offset * this.ray,
                Math.sin(angle) * offset * this.ray,
                (i / this.points_depth) - 0.5,
            )
            position.setXYZ(index, vertex.x, vertex.y, vertex.z)
        }
    }

    private animateWave(): void {
        if (this.delta > 0.1) {
            this.left -= this.delta * 2.0
            this.right -= this.delta * 0.4
        } else {
            this.left -= 0.1
            this.right -= 0.002
        }
        let angle = 0.0
        let indexes = []
        this.offset += 0.05
        const delta = Math.PI * 2.0 / this.points_length
        const position = this.points_geometry.attributes.position
        const length = position.count
        for (let i = 0; i < length; i++) {
            if (i % this.points_depth === 0) {
                this.vertical(position, indexes, angle)
                angle += delta
                indexes = []
                this.left -= 1.0
                this.right += 1.0
            }
            indexes.push(i)
        }
        position.needsUpdate = true
    }


    private fourierSeries(x: number, l: number): number {
        const amp = 0.1 + this.delta * 0.1
        if (x % this.l1 === 0) {
            this.n = Math.floor(Math.random() * 3) + 1
        }
        let sum = 0
        for (let n = 1; n <= this.n; n++) {
            sum += Math.sin(2 * Math.PI * n * x / l) / n
        }
        return sum * amp + amp * this.n
    }
}