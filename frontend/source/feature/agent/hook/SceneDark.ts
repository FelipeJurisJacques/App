import * as THREE from 'three'
import Scene from '../type/Scene'
import Core from '../component/Core'
import Particles from '../component/Particles'

export default class SceneDark implements Scene {
    private readonly core: Core
    public readonly scene: THREE.Scene
    private readonly particles1: Particles
    private readonly particles2: Particles
    private readonly ringSegments: THREE.Mesh[] = []

    public constructor() {
        this.core = new Core()
        this.ringSegments = []
        this.scene = new THREE.Scene()
        this.scene.add(this.core.base)
        this.particles1 = new Particles({
            size: 0.015,
            particles: 2999,
            noiseScale: 0.3,
            noiseFactor: 1.0,
            radiusInternal: 1.5,
            radiusExternal: 1.7,
            noiseTangentialScale: 1.0,
        })
        this.particles2 = new Particles({
            size: 0.05,
            delta: 0.5,
            particles: 259,
            noiseScale: 0.5,
            coronastar: true,
            noiseFactor: 0.4,
            radiusInternal: 1.5,
            radiusExternal: 1.7,
        })
        this.scene.add(this.particles1.base)
        this.scene.add(this.particles2.base)
        const ringGroup = new THREE.Group()
        this.scene.add(ringGroup)
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
                transparent: false,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            })
            const techRing = new THREE.Mesh(ringGeo, ringMat)
            techRing.userData.angle = i
            this.ringSegments.push(techRing)
            ringGroup.add(techRing)
        }
    }

    public animate(): void {
        const time = Date.now() * 0.001
        this.core.animate()
        this.particles1.animate(time)
        this.particles2.animate(time)
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