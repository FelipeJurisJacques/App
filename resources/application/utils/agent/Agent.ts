import * as THREE from 'three'
import Particles from './vfx/Particles'

export default class Agent {
    private readonly particles: Particles
    private readonly scenes: THREE.Scene[]
    private readonly coreGroup: THREE.Group
    private readonly ringSegments: THREE.Mesh[] = []

    public constructor() {
        this.particles = new Particles()
        this.scenes = [
            this.particles.getScene()
        ]

        // nucleo
        let scene = new THREE.Scene()
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
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                wireframe: false,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
            const techRing = new THREE.Mesh(ringGeo, ringMat)
            techRing.userData.angle = i
            this.ringSegments.push(techRing)
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
        this.particles.animate(time)

        // Rotação suave para mostrar a complexidade 3D
        this.coreGroup.rotation.y += 0.001
        this.coreGroup.rotation.x += 0.0005

        // Iluminação orbital do anel
        // Começa em 45 graus (Math.PI / 4) e se move no tempo
        const lightPos = (Math.PI / 4) + (time * 0.05)
        for (const segment of this.ringSegments) {
            const angle = segment.userData.angle as number
            // Calcula a distância angular curta entre o segmento e o ponto de luz
            const dist = Math.atan2(Math.sin(angle - lightPos), Math.cos(angle - lightPos))
            // Intensidade baseada no cosseno da distância (mais próximo = mais iluminado)
            // Elevamos ao cubo para tornar o feixe mais "fechado" e menos simétrico (degradê rápido)
            const intensity = Math.pow(Math.max(0, Math.cos(dist)), 3)
            const mat = segment.material as THREE.MeshBasicMaterial
            mat.opacity = 0.1 + intensity * 0.9
        }

        // // OPCIONAL: Adicionar uma pulsação sutil na opacidade para simular o "pensamento"
        // this.coreGroup.material.opacity = 0.7 + Math.sin(time * 2) * 0.2
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