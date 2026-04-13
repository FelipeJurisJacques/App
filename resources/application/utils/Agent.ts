import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

export default class Agent {
    private readonly numParticles: number
    private readonly simplex: SimplexNoise
    private readonly scenes: THREE.Scene[]
    private readonly coreGroup: THREE.Group
    private readonly particleNoisePoints1: THREE.Points
    private readonly particleNoisePoints2: THREE.Points
    private readonly particleNoisePositions1: Float32Array
    private readonly particleNoisePositions2: Float32Array

    public constructor() {
        this.scenes = []
        this.numParticles = 4096
        this.simplex = new SimplexNoise()
        const glowTexture = this.createGlowTexture()

        // nevoa fluida
        let scene = new THREE.Scene()
        this.scenes.push(scene)

        const material = new THREE.PointsMaterial({
            size: 0.05,
            opacity: 0.5,
            color: 0xaaffff,
            map: glowTexture,
            depthWrite: false,
            transparent: true,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
        })

        const sphereGeometry1 = new THREE.BufferGeometry()
        const sphereGeometry2 = new THREE.BufferGeometry()
        const positions1 = new Float32Array(this.numParticles * 3)
        const positions2 = new Float32Array(this.numParticles * 3)
        this.particleNoisePositions1 = new Float32Array(this.numParticles * 3)
        this.particleNoisePositions2 = new Float32Array(this.numParticles * 3)

        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3
            const [px, py, pz] = this.cloud(2.0, 1.9)
            positions1[i3 + 0] = px!
            positions1[i3 + 1] = py!
            positions1[i3 + 2] = pz!
            this.particleNoisePositions1[i3 + 0] = px!
            this.particleNoisePositions1[i3 + 1] = py!
            this.particleNoisePositions1[i3 + 2] = pz!
        }

        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3
            const [px, py, pz] = this.cloud(1.6, 1.5)
            positions2[i3 + 0] = px!
            positions2[i3 + 1] = py!
            positions2[i3 + 2] = pz!
            this.particleNoisePositions2[i3 + 0] = px!
            this.particleNoisePositions2[i3 + 1] = py!
            this.particleNoisePositions2[i3 + 2] = pz!
        }

        sphereGeometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3))
        sphereGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
        this.particleNoisePoints1 = new THREE.Points(sphereGeometry1, material)
        this.particleNoisePoints2 = new THREE.Points(sphereGeometry2, material)
        this.particleNoisePoints1.position.set(0, 0, 0)
        this.particleNoisePoints2.position.set(0, 0, 0)
        scene.add(this.particleNoisePoints1)
        scene.add(this.particleNoisePoints2)

        // nucleo
        scene = new THREE.Scene()
        this.scenes.push(scene)

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
        scene.add(this.coreGroup)

        // bloom (glow)
        const centralGlowTexture = this.createCentralGlowTexture()
        const centralGlowMaterial = new THREE.SpriteMaterial({
            transparent: true,
            depthWrite: false,
            map: centralGlowTexture,
            blending: THREE.AdditiveBlending,
        })
        const centralGlow = new THREE.Sprite(centralGlowMaterial)
        centralGlow.scale.set(7, 7, 1)
        scene.add(centralGlow)

        const ambientLight = new THREE.AmbientLight(0x021111, 0.5)
        scene.add(ambientLight)

        // anel
        scene = new THREE.Scene()
        const ringGroup = new THREE.Group()
        const ringMat = new THREE.MeshBasicMaterial({
            // opacity: 0.4,
            color: 0x00ffff,
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        })
        this.scenes.push(scene)
        for (let i = 0.01; i < Math.PI * 2; i += Math.PI / 32) {
            const ringGeo = new THREE.RingGeometry(
                1.2, // innerRadius
                1.5, // outerRadius
                1, // thetaSegments
                1, // phiSegments
                i, // thetaStart
                Math.PI / 40 // thetaEnd
            )
            const techRing = new THREE.Mesh(ringGeo, ringMat)
            ringGroup.add(techRing)
        }
        scene.add(ringGroup)
    }

    public getScenes(): THREE.Scene[] {
        return this.scenes
    }

    public speak(message: string): void {
        const speak = new SpeechSynthesisUtterance(message)
        speak.rate = 2
        speak.pitch = 1
        speak.volume = 1
        window.speechSynthesis.speak(speak)
    }

    public animate(): void {
        const time = Date.now() * 0.001
        const buffer = this.particleNoisePoints1.geometry.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < this.numParticles; i++) {
            this.noise(buffer, this.particleNoisePositions1, 0.1, 1.0, time, i)
        }
        buffer.needsUpdate = true

        const buffer2 = this.particleNoisePoints2.geometry.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < this.numParticles; i++) {
            this.noise(buffer2, this.particleNoisePositions2, 0.05, 0.7, time, i)
        }
        buffer2.needsUpdate = true

        // Rotação suave para mostrar a complexidade 3D
        this.coreGroup.rotation.y += 0.001
        this.coreGroup.rotation.x += 0.0005

        // // OPCIONAL: Adicionar uma pulsação sutil na opacidade para simular o "pensamento"
        // this.coreGroup.material.opacity = 0.7 + Math.sin(time * 2) * 0.2
    }

    private noise(
        buffer: THREE.BufferAttribute,
        positions: Float32Array,
        noiseFactor: number,
        noiseScale: number,
        time: number,
        index: number
    ): void {
        const i3 = index * 3

        // posicao do efeito
        const bx = positions[i3 + 0]!
        const by = positions[i3 + 1]!
        const bz = positions[i3 + 2]!

        // deslocamento aplicado em relacao a base
        const offset = this.simplex.noise4d(
            bx * noiseScale,
            by * noiseScale,
            bz * noiseScale,
            time * 0.3
        ) * noiseFactor

        // efeito de transicao natural
        const length = Math.sqrt(bx * bx + by * by + bz * bz) || 1
        const nx = bx / length
        const ny = by / length
        const nz = bz / length

        // escrita do deslocamento
        const finalX = bx + nx * offset
        const finalY = by + ny * offset
        const finalZ = bz + nz * offset
        buffer.setXYZ(index, finalX, finalY, finalZ)
    }

    private cloud(externalRadius: number, internalRadius: number, center: boolean = false): Array<number> {
        let isValid = false
        let px = 0, py = 0, pz = 0
        while (!isValid) {
            const r = externalRadius * Math.cbrt(Math.random())
            const theta = Math.random() * 2 * Math.PI
            const phi = Math.acos(2 * Math.random() - 1)

            px = r * Math.sin(phi) * Math.cos(theta)
            py = r * Math.sin(phi) * Math.sin(theta)
            pz = r * Math.cos(phi)

            const distXY = Math.sqrt(px * px + py * py)
            if (distXY >= internalRadius) {
                isValid = true
            }
        }
        return [px, py, pz]
    }

    private createGlowTexture(): THREE.CanvasTexture {
        const canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 16
        const context = canvas.getContext('2d')!

        const gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        )

        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.2, 'rgba(0, 255, 255, 0.8)')
        gradient.addColorStop(0.5, 'rgba(0, 128, 128, 0.3)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)

        return new THREE.CanvasTexture(canvas)
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