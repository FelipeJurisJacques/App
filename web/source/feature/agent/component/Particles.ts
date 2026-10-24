import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

interface Configuration {
    // --- Campos originais (mantidos para retrocompatibilidade) ---
    size: number
    angle?: number
    collor: number
    delta?: number
    falloff: number
    particles: number
    coronastar?: boolean
    radiusInternal: number
    radiusExternal: number

    // --- Ruído de fundo (opcional; desligado por padrão) ---
    noiseScale?: number
    noiseFactor?: number
    noiseTangentialScale?: number
    noiseTangentialFactor?: number
    deltaTangetial?: number

    // --- Ondas (novos) ---
    waveAmplitude?: number        // 0 = parado, 1 = normal, 2+ = agitado
    waveMaxCount?: number         // ondas simultâneas (default: 3)
    waveSpawnInterval?: number    // segundos base entre spawns (default: 2.0)
    waveSpeed?: number            // velocidade angular base em rad/s (default: 1.0)
    waveWidth?: number            // sigma do envelope angular (default: 0.4)
    waveWavelength?: number       // período espacial dentro do envelope (default: 5.0)
    waveLife?: number             // duração em segundos (default: 6.0)
    waveDistortion?: number       // deformação orgânica da frente (default: 0.15)
    waveRadialStrength?: number   // escala do deslocamento radial (default: 0.4)
    waveTangentialFactor?: number // fração do radial que vira tangencial (default: 0.3)
    waveSpawnJitter?: number      // variação aleatória no intervalo de spawn (default: 0.5)
}

interface Wave {
    origin: THREE.Vector3  // ponto unitário na esfera (direção)
    birth: number          // tempo de nascimento
    speed: number          // velocidade angular (rad/s)
    width: number          // sigma do envelope
    wavelength: number     // período espacial
    polarity: number       // +1 ou -1
    life: number           // duração
    seed: number           // semente para distorção orgânica
    amplitude: number      // amplitude individual (herdada do momento do spawn)
}

export default class Particles {
    public readonly base: THREE.Points
    private readonly simplex: SimplexNoise
    private readonly positions: Float32Array
    private readonly configuration: Configuration

    // Estado das ondas
    private waves: Wave[]
    private lastSpawnTime: number

    // Reutilização de vetores (evita alocação por partícula)
    private readonly _n = new THREE.Vector3()
    private readonly _p = new THREE.Vector3()
    private readonly _tangential = new THREE.Vector3()
    private readonly _toP = new THREE.Vector3()

    public constructor(configuration: Configuration) {
        this.simplex = new SimplexNoise()
        this.configuration = configuration
        this.waves = []
        this.lastSpawnTime = 0

        this.positions = this.sphereVertices(
            this.configuration.radiusExternal,
            this.configuration.radiusInternal,
            this.configuration.particles
        )

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(this.positions, 3)
        )
        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(this.configuration.particles * 3, 3)
        )

        if (this.configuration.coronastar) {
            const glowTexture = this.createGlowTexture()
            const material = new THREE.PointsMaterial({
                opacity: 1.0,
                map: glowTexture,
                depthWrite: false,
                transparent: true,
                vertexColors: true,
                sizeAttenuation: true,
                size: this.configuration.size,
                blending: THREE.AdditiveBlending,
                color: this.configuration.collor,
            })
            this.base = new THREE.Points(geometry, material)
        } else {
            const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
            const material = new THREE.PointsMaterial({
                opacity: 1.0,
                depthWrite: false,
                transparent: true,
                vertexColors: true,
                sizeAttenuation: true,
                clipIntersection: false,
                size: this.configuration.size,
                clippingPlanes: [clippingPlane],
                blending: THREE.AdditiveBlending,
                color: this.configuration.collor,
            })
            this.base = new THREE.Points(geometry, material)
        }
        this.base.position.set(0, 0, 0)
        this.base.rotation.z = this.configuration.angle ?? 0.0
    }

    // ============================================================
    // API pública: amplitude controlável em tempo real
    // ============================================================

    /**
     * Amplitude das ondas. Controla simultaneamente:
     *  - velocidade de propagação da frente
     *  - altura do deslocamento radial
     *  - frequência de spawn de novas ondas
     *
     *  0.0 → parado
     *  0.3 → suave e lento
     *  1.0 → normal
     *  2.5 → agitado e rápido
     */
    public get amplitude(): number {
        return this.configuration.waveAmplitude ?? 1.0
    }

    public set amplitude(value: number) {
        this.configuration.waveAmplitude = Math.max(0, value)
    }

    /**
     * Remove todas as ondas ativas imediatamente.
     */
    public clearWaves(): void {
        this.waves.length = 0
    }

    // ============================================================
    // Loop principal
    // ============================================================

    /**
     * @param time    tempo em segundos (idealmente contínuo)
     * @param entropy modulador externo 0..1 (opcional; multiplica a amplitude)
     */
    public animate(time: number, entropy: number = 1.0): void {
        const effectiveAmplitude = this.amplitude * entropy

        // 1. Atualiza ciclo de vida das ondas
        this.updateWaves(time, effectiveAmplitude)

        // 2. Atualiza cada partícula
        const colorAttr = this.base.geometry.getAttribute('color') as THREE.BufferAttribute
        const posAttr = this.base.geometry.getAttribute('position') as THREE.BufferAttribute

        for (let i = 0; i < this.configuration.particles; i++) {
            this.updateParticle(posAttr, colorAttr, this.positions, time, i, effectiveAmplitude)
        }

        posAttr.needsUpdate = true
        colorAttr.needsUpdate = true
    }

    // ============================================================
    // Gerenciamento de ondas
    // ============================================================

    private updateWaves(time: number, amplitude: number): void {
        // Remove ondas mortas e atualiza amplitude das vivas para dissipação suave
        if (this.waves.length > 0) {
            for (let i = this.waves.length - 1; i >= 0; i--) {
                const w = this.waves[i]!
                if (time - w.birth > w.life) {
                    this.waves.splice(i, 1)
                } else {
                    // Interpola a amplitude da onda em direção à amplitude global atual.
                    // Isso faz com que as ondas se dissipem naturalmente quando o efeito termina,
                    // em vez de manterem força total até sumirem abruptamente.
                    w.amplitude += (amplitude - w.amplitude) * 0.05
                }
            }
        }

        // Se amplitude ~ 0, não spawna novas ondas (mas deixa as existentes morrerem)
        if (amplitude < 0.01) return

        const maxCount = this.configuration.waveMaxCount ?? 3
        if (this.waves.length >= maxCount) return

        const baseInterval = this.configuration.waveSpawnInterval ?? 2.0
        const jitter = this.configuration.waveSpawnJitter ?? 0.5
        // Amplitude maior → spawn mais frequente
        const interval = (baseInterval / (0.5 + amplitude)) * (1.0 + (Math.random() - 0.5) * jitter)

        if (time - this.lastSpawnTime >= interval) {
            this.waves.push(this.createWave(time, amplitude))
            this.lastSpawnTime = time
        }
    }

    private createWave(time: number, amplitude: number): Wave {
        // Ponto aleatório uniforme na esfera
        const u = Math.random() * 2 - 1
        const theta = Math.random() * Math.PI * 2
        const s = Math.sqrt(1 - u * u)
        const origin = new THREE.Vector3(
            s * Math.cos(theta),
            u,
            s * Math.sin(theta)
        )

        return {
            origin,
            birth: time,
            speed: (this.configuration.waveSpeed ?? 1.0) * (0.8 + Math.random() * 0.4),
            width: (this.configuration.waveWidth ?? 0.4) * (0.8 + Math.random() * 0.4),
            wavelength: (this.configuration.waveWavelength ?? 5.0) * (0.85 + Math.random() * 0.3),
            polarity: Math.random() > 0.5 ? 1 : -1,
            life: (this.configuration.waveLife ?? 6.0) * (0.8 + Math.random() * 0.4),
            seed: Math.random() * 1000,
            amplitude: amplitude,
        }
    }

    /**
     * ANIMACAO INDIVIDUAL POR PARTICULA
     */
    private updateParticle(
        posAttr: THREE.BufferAttribute,
        colorAttr: THREE.BufferAttribute,
        positions: Float32Array,
        time: number,
        index: number,
        amplitude: number
    ): void {
        const i3 = index * 3

        const bx = positions[i3 + 0]!
        const by = positions[i3 + 1]!
        const bz = positions[i3 + 2]!

        const length = Math.sqrt(bx * bx + by * by + bz * bz) || 1
        const nx = bx / length
        const ny = by / length
        const nz = bz / length

        // 1. Tremor de fundo (ruído Simplex opcional)
        let radialBg = 0
        let tangentialBg = 0
        const bgScale = this.configuration.noiseScale
        if (bgScale !== undefined && bgScale !== 0) {
            const bgFactor = this.configuration.noiseFactor ?? 0.4
            const bgNoise = this.simplex.noise4d(
                bx * bgFactor, by * bgFactor, bz * bgFactor,
                time * (this.configuration.delta ?? 1.0)
            )
            radialBg = bgNoise * bgScale * 0.5

            const tFactor = this.configuration.noiseTangentialFactor ?? bgFactor
            const tScale = this.configuration.noiseTangentialScale ?? bgScale
            const tNoise = this.simplex.noise4d(
                bx * tFactor, by * tFactor, bz * tFactor,
                time * ((this.configuration.deltaTangetial ?? this.configuration.delta) ?? 1.0)
            )
            tangentialBg = tNoise * tScale * 0.3
        }

        // 2. Contribuição das ondas (soma linear)
        let totalRadial = radialBg
        let totalTangentialX = 0
        let totalTangentialY = 0
        let totalTangentialZ = 0

        const distortionAmt = this.configuration.waveDistortion ?? 0.15
        const radialStrength = this.configuration.waveRadialStrength ?? 0.4
        const tangentialFactor = this.configuration.waveTangentialFactor ?? 0.3

        for (let w = 0; w < this.waves.length; w++) {
            const wave = this.waves[w]!

            // Distância angular à origem
            const cosAngle = nx * wave.origin.x + ny * wave.origin.y + nz * wave.origin.z
            const clampedCos = cosAngle > 1 ? 1 : cosAngle < -1 ? -1 : cosAngle
            const angle = Math.acos(clampedCos)

            // Frente deformada organicamente
            let distortion = 0
            if (distortionAmt > 0) {
                distortion = this.simplex.noise3d(
                    nx * 2 + wave.seed,
                    ny * 2 + wave.seed,
                    nz * 2 + wave.seed
                ) * distortionAmt
            }

            const age = time - wave.birth
            // A frente propaga com velocidade constante; a amplitude global
            // já controla a intensidade via wave.amplitude (interpolada no updateWaves).
            // Usar amplitude aqui fazia a frente retroceder quando o efeito terminava.
            const front = age * wave.speed + distortion
            const distToFront = angle - front

            // Envelope gaussiano
            const envelope = Math.exp(
                -(distToFront * distToFront) / (2 * wave.width * wave.width)
            )

            // Oscilação interna (crista/cava)
            const oscillation = Math.cos(distToFront * wave.wavelength) * wave.polarity

            // Deslocamento radial desta onda
            const radialOffset = oscillation * wave.amplitude * envelope * radialStrength

            totalRadial += radialOffset

            // Direção tangencial: projeção de (p - origin) no plano tangente em p
            if (Math.abs(radialOffset) > 1e-5) {
                this._p.set(bx, by, bz)
                this._toP.copy(this._p).sub(wave.origin)
                this._n.set(nx, ny, nz)

                const dot = this._toP.dot(this._n)
                this._tangential.copy(this._toP).addScaledVector(this._n, -dot)

                const tLen = this._tangential.length()
                if (tLen > 1e-4) {
                    this._tangential.multiplyScalar(1 / tLen)
                    const tOffset = radialOffset * tangentialFactor
                    totalTangentialX += this._tangential.x * tOffset
                    totalTangentialY += this._tangential.y * tOffset
                    totalTangentialZ += this._tangential.z * tOffset
                }
            }
        }

        // 3. Tremor de fundo tangencial (aplicado ao longo da direção derivada da normal)
        if (tangentialBg !== 0) {
            // Direção tangencial arbitrária: n × up (com fallback)
            let tx = -ny
            let ty = nx
            let tz = 0
            if (Math.abs(ny) > 0.99) {
                tx = 1; ty = 0; tz = 0
            }
            const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1
            tx /= tLen; ty /= tLen; tz /= tLen
            totalTangentialX += tx * tangentialBg
            totalTangentialY += ty * tangentialBg
            totalTangentialZ += tz * tangentialBg
        }

        // 4. Posição final
        const finalX = bx + nx * totalRadial + totalTangentialX
        const finalY = by + ny * totalRadial + totalTangentialY
        const finalZ = bz + nz * totalRadial + totalTangentialZ

        posAttr.setXYZ(index, finalX, finalY, finalZ)

        // 5. Brilho com efeito cilíndrico
        //    Partículas próximas ao plano XY (|Z| pequeno) brilham mais;
        //    profundas (|Z| grande) desaparecem — reforçando a leitura de cilindro.
        const depth = Math.abs(finalZ)
        const falloff = this.configuration.falloff || 1.0
        const brightness = Math.pow(Math.max(0, 1.0 - depth / falloff), 2.5)

        colorAttr.setXYZ(index, brightness, brightness, brightness)
    }

    /**
     * GEOMETRIA
     */
    private sphereVertices(radius: number, internalRadius: number, count: number): Float32Array {
        const allPoints: number[][] = []
        const resPhi = 100
        const resTheta = 200

        for (let i = 0; i < resPhi; i++) {
            const phi = (i / (resPhi - 1)) * Math.PI
            for (let j = 0; j < resTheta; j++) {
                const theta = (j / (resTheta - 1)) * 2 * Math.PI

                const px = radius * Math.sin(phi) * Math.cos(theta)
                const py = radius * Math.sin(phi) * Math.sin(theta)
                const pz = radius * Math.cos(phi)

                const distXY = Math.sqrt(px * px + py * py)
                if (pz > 0 && distXY >= internalRadius) {
                    allPoints.push([px, py, pz])
                }
            }
        }

        const positions = new Float32Array(count * 3)
        if (allPoints.length === 0) return positions

        for (let i = 0; i < count; i++) {
            const idx = Math.floor((i / count) * allPoints.length)
            const p = allPoints[idx]!
            const i3 = i * 3
            positions[i3 + 0] = p[0]!
            positions[i3 + 1] = p[1]!
            positions[i3 + 2] = p[2]!
        }
        return positions
    }

    /**
     * PARTICULAS
     */
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
}