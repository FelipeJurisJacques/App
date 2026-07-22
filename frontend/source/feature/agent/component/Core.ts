import * as THREE from 'three'

interface Configuration {
    collor: number
    rotationX: number
    rotationY: number
    particles: boolean
}

export default class Core {
    public readonly base: THREE.Group
    private readonly coreGroup: THREE.Group
    private readonly configuration: Configuration

    public constructor(configuration: Configuration) {
        this.base = new THREE.Group
        this.coreGroup = new THREE.Group()
        this.configuration = configuration
        const coreGeometry = new THREE.IcosahedronGeometry(0.7, 5)
        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        this.coreGroup.add(new THREE.Mesh(coreGeometry, new THREE.MeshBasicMaterial({
            opacity: 0.3,
            wireframe: true,
            depthWrite: false,
            transparent: true,
            clipIntersection: false,
            clippingPlanes: [clippingPlane],
            color: this.configuration.collor,
            blending: THREE.AdditiveBlending,
        })))
        if (this.configuration.particles) {
            this.coreGroup.add(new THREE.Points(coreGeometry, new THREE.PointsMaterial({
                size: 0.03,
                opacity: 0.5,
                depthWrite: false,
                transparent: true,
                sizeAttenuation: true,
                clipIntersection: false,
                clippingPlanes: [clippingPlane],
                color: this.configuration.collor,
                blending: THREE.AdditiveBlending,
            })))
        }
        this.base.add(this.coreGroup)
        this.base.add(new THREE.AmbientLight(0x021111, 0.5))
        const centralGlow = new THREE.Sprite(new THREE.SpriteMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            map: this.createCentralGlowTexture(),
        }))
        centralGlow.scale.set(7, 7, 1)
        this.base.add(centralGlow)
    }

    public animate(): void {
        this.coreGroup.rotation.y += this.configuration.rotationX
        this.coreGroup.rotation.x += this.configuration.rotationY
    }

    private createCentralGlowTexture(): THREE.CanvasTexture {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const context = canvas.getContext('2d')!

        const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)')
        gradient.addColorStop(0.4, 'rgba(0, 150, 150, 0.1)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        context.fillStyle = gradient
        context.fillRect(0, 0, 128, 128)

        return new THREE.CanvasTexture(canvas)
    }
}