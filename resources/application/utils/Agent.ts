import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

export default class Agent {
    private readonly numParticles: number
    private readonly particleSphere: THREE.Points
    private readonly simplex: SimplexNoise
    private readonly radius: number
    private readonly basePositions: Float32Array

    public constructor(scene: THREE.Scene) {
        this.numParticles = 8000 // Milhares de partículas
        this.simplex = new SimplexNoise()
        this.radius = 2.0

        const sphereGeometry = new THREE.BufferGeometry()

        const radius = this.radius
        const positions = new Float32Array(this.numParticles * 3)
        this.basePositions = new Float32Array(this.numParticles * 3)

        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3

            // Geração de pontos aleatórios no volume da esfera (nuvem) em vez da casca com padrão
            const r = radius * Math.cbrt(Math.random())
            const theta = Math.random() * 2 * Math.PI
            const phi = Math.acos(2 * Math.random() - 1)

            const px = r * Math.sin(phi) * Math.cos(theta)
            const py = r * Math.sin(phi) * Math.sin(theta)
            const pz = r * Math.cos(phi)

            // Guardamos a posição base para referenciar na animação
            this.basePositions[i3 + 0] = px
            this.basePositions[i3 + 1] = py
            this.basePositions[i3 + 2] = pz

            positions[i3 + 0] = px
            positions[i3 + 1] = py
            positions[i3 + 2] = pz
        }

        sphereGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        // Material Ciano Jarvis com transparência e brilho
        const jarvisMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.03, // Aumentado para garantir visibilidade com a câmera mais distante
            sizeAttenuation: true,
            transparent: true, // Importante para o efeito de rastro
            opacity: 0.6,      // Mais translúcido devido à maior quantidade de partículas
            blending: THREE.AdditiveBlending, // Ajuda os pontos que se sobrepõem a brilharem
        })

        this.particleSphere = new THREE.Points(sphereGeometry, jarvisMaterial)
        this.particleSphere.position.set(0, 0, 0) // No centro para a câmera em Z = 5 capturar bem
        scene.add(this.particleSphere)
    }

    public animate(): void {
        const time = Date.now() * 0.001
        const positionAttribute = this.particleSphere.geometry.getAttribute('position') as THREE.BufferAttribute

        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3

            // Lemos a coordenada base que foi gerada aleatoriamente
            const bx = this.basePositions[i3 + 0]!
            const by = this.basePositions[i3 + 1]!
            const bz = this.basePositions[i3 + 2]!

            // Usando ruído 4D (espaço 3D + tempo) para movimento fluido da névoa
            const noiseScale = 0.8
            const noiseFactor = 0.5

            // O deslocamento é aplicado baseado na própria posição no espaço
            const offset = this.simplex.noise4d(bx * noiseScale, by * noiseScale, bz * noiseScale, time * 0.3) * noiseFactor

            // Queremos que a partícula transite de forma natural, espalhando-se a partir do centro
            const length = Math.sqrt(bx * bx + by * by + bz * bz) || 1
            const nx = bx / length
            const ny = by / length
            const nz = bz / length

            const finalX = bx + nx * offset
            const finalY = by + ny * offset
            const finalZ = bz + nz * offset

            positionAttribute.setXYZ(i, finalX, finalY, finalZ)
        }

        positionAttribute.needsUpdate = true
    }

    public speak(message: string): void {
        const speak = new SpeechSynthesisUtterance(message)
        speak.rate = 2
        speak.pitch = 1
        speak.volume = 1
        window.speechSynthesis.speak(speak)
    }
}