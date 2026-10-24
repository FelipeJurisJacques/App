import * as THREE from 'three'
import Scene from '../type/Scene'
import Core from '../component/Core'
import Particles from '../component/Particles'

export default class SceneDark implements Scene {
    private delta: number
    private entropy: number
    private readonly core: Core
    public readonly scene: THREE.Scene
    private readonly ringSegments: THREE.Mesh[]
    private readonly particles: Array<Particles>

    public constructor() {
        this.delta = 0.0
        this.entropy = 0.0
        this.core = new Core({
            particles: true,
            rotationX: 0.01,
            collor: 0x00ffff,
            rotationY: 0.005,
        })
        this.ringSegments = []
        this.scene = new THREE.Scene()
        this.scene.add(this.core.base)
        this.particles = [
            new Particles({
                size: 0.05,
                falloff: 2.0,
                particles: 197,
                coronastar: true,
                collor: 0xaaffff,
                radiusInternal: 1.0,
                radiusExternal: 1.7,
                waveAmplitude: 1.0,
                waveMaxCount: 2,
                waveSpeed: 0.3,          // ondas lentas
                waveWidth: 0.5,          // envelope largo (ondas suaves)
                waveWavelength: 6.0,
                waveLife: 8.0,
                waveRadialStrength: 0.5, // deslocamento grande
                waveTangentialFactor: 0.4,
            }),
            new Particles({
                size: 0.015,
                falloff: 1.8,
                particles: 6000,
                collor: 0xaaffff,
                radiusInternal: 0.7,
                radiusExternal: 1.7,
                waveAmplitude: 1.0,
                waveMaxCount: 10,         // mais ondas simultâneas
                waveSpeed: 2.0,          // mais rápidas
                waveWidth: 0.3,          // envelope estreito
                waveWavelength: 5.0,
                waveLife: 2.0,
                waveRadialStrength: 0.2, // deslocamento menor
                waveTangentialFactor: 0.3,
            }),
            new Particles({
                size: 0.015,
                falloff: 1.6,
                particles: 4000,
                collor: 0xaaffff,
                radiusInternal: 0.7,
                radiusExternal: 1.5,
                waveAmplitude: 0.8,
                waveMaxCount: 10,
                waveSpeed: 2.0,
                waveWidth: 0.35,
                waveWavelength: 4.5,
                waveLife: 2.0,
                waveRadialStrength: 0.1,
                waveTangentialFactor: 0.35,
            })
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

    public get intensity(): number {
        return this.entropy
    }

    public set intensity(value: number) {
        if (value > 1.0) {
            this.entropy = 1.0
        } else if (value < 0.0) {
            this.entropy = 0.0
        } else {
            this.entropy = value
        }
    }

    public animate(): void {
        this.core.animate()
        const time = Date.now() * 0.001
        const diff = this.entropy - this.delta
        if (Math.abs(diff) < 0.005) {
            this.delta = this.entropy
        } else {
            this.delta += diff * 0.1
        }
        for (let particles of this.particles) {
            particles.animate(time, this.delta)
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