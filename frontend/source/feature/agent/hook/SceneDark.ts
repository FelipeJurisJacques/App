import * as THREE from 'three'
import Scene from '../type/Scene'
import Core from '../component/Core'
import Particles from '../component/Particles'

export default class SceneDark implements Scene {
    private readonly core: Core
    public readonly scene: THREE.Scene
    private readonly ringSegments: THREE.Mesh[]
    private readonly particles: Array<Particles>

    public constructor() {
        this.core = new Core({
            particles: true,
            rotationX: 0.01,
            rotationY: 0.005,
        })
        this.ringSegments = []
        this.scene = new THREE.Scene()
        this.scene.add(this.core.base)
        this.particles = [
            new Particles({
                size: 0.05,
                delta: 0.5,
                falloff: 2.0,
                particles: 197,
                noiseScale: 0.4,
                collor: 0xaaffff,
                coronastar: true,
                noiseFactor: 0.4,
                radiusInternal: 1.0,
                radiusExternal: 1.7,
                noiseTangentialScale: 1.0,
            }),
            new Particles({
                delta: 1.0,
                size: 0.015,
                falloff: 1.8,
                particles: 6000,
                noiseScale: 0.2,
                collor: 0xaaffff,
                noiseFactor: 1.0,
                radiusExternal: 1.7,
                radiusInternal: 0.7,
                deltaTangetial: 0.5,
                noiseTangentialScale: 1.0,
            }),
            new Particles({
                delta: 1.0,
                size: 0.015,
                falloff: 1.6,
                particles: 4000,
                noiseScale: 0.2,
                noiseFactor: 1.0,
                collor: 0xaaffff,
                radiusExternal: 1.5,
                radiusInternal: 0.7,
                deltaTangetial: 0.5,
                noiseTangentialScale: 1.0,
            }),
        ]
        const ringGroup = new THREE.Group()
        for (let i = 0.01; i < Math.PI * 2; i += Math.PI / 32) {
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                wireframe: false,
                transparent: false,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
            const ringGeo = new THREE.RingGeometry(
                1.1, // innerRadius
                1.4, // outerRadius
                1, // thetaSegments
                1, // phiSegments
                i, // thetaStart
                Math.PI / 40 // thetaEnd
            )
            const techRing = new THREE.Mesh(ringGeo, ringMat)
            techRing.userData.angle = i
            this.ringSegments.push(techRing)
            ringGroup.add(techRing)
        }
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00cccc,
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        })
        for (let i = 0.01; i < Math.PI * 2; i += Math.PI / 64) {
            const ringGeo = new THREE.RingGeometry(
                0.8, // innerRadius
                0.85, // outerRadius
                1, // thetaSegments
                1, // phiSegments
                i, // thetaStart
                Math.PI / 128 // thetaEnd
            )
            const techRing = new THREE.Mesh(ringGeo, ringMat)
            techRing.userData.angle = i
            ringGroup.add(techRing)
        }
        this.scene.add(ringGroup)
        for (let particles of this.particles) {
            this.scene.add(particles.base)
        }
    }

    public animate(): void {
        const time = Date.now() * 0.001
        this.core.animate()
        for (let particles of this.particles) {
            particles.animate(time)
        }
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
    }
}