import * as THREE from 'three'

export default class Core {
    public readonly base: THREE.Group
    private readonly coreGroup: THREE.Group

    public constructor() {
        this.base = new THREE.Group
        const coreGeometry = new THREE.IcosahedronGeometry(0.7, 5)
        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            opacity: 0.3,
            color: 0x00ffff,
            wireframe: true,
            depthWrite: false,
            transparent: true,
            clipIntersection: false,
            clippingPlanes: [clippingPlane],
            blending: THREE.AdditiveBlending,
        })
        const coreWireframe = new THREE.Mesh(coreGeometry, wireframeMaterial)
        const pointsMaterial = new THREE.PointsMaterial({
            size: 0.03,
            opacity: 0.5,
            color: 0x00ffff,
            depthWrite: false,
            transparent: true,
            sizeAttenuation: true,
            clipIntersection: false,
            clippingPlanes: [clippingPlane],
            blending: THREE.AdditiveBlending,
        })
        const corePoints = new THREE.Points(coreGeometry, pointsMaterial)
        this.coreGroup = new THREE.Group()
        this.coreGroup.add(coreWireframe)
        this.coreGroup.add(corePoints)
        this.base.add(this.coreGroup)

        const centralGlowTexture = this.createCentralGlowTexture()
        const centralGlowMaterial = new THREE.SpriteMaterial({
            transparent: true,
            depthWrite: false,
            map: centralGlowTexture,
            blending: THREE.AdditiveBlending,
        })
        const centralGlow = new THREE.Sprite(centralGlowMaterial)
        centralGlow.scale.set(7, 7, 1)
        this.base.add(centralGlow)
        const ambientLight = new THREE.AmbientLight(0x021111, 0.5)
        this.base.add(ambientLight)
    }

    public animate(): void {
        this.coreGroup.rotation.y += 0.01
        this.coreGroup.rotation.x += 0.005
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