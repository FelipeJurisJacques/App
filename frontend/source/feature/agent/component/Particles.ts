import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

interface Configuration {
    size: number,
    angle?: number
    delta?: number
    particles: number
    noiseScale: number
    noiseFactor: number
    coronastar?: boolean
    radiusInternal: number
    radiusExternal: number
    noiseTangentialScale?: number
}

export default class Particles {
    public readonly base: THREE.Points
    private readonly simplex: SimplexNoise
    private readonly positions: Float32Array
    private readonly configuration: Configuration

    public constructor(configuration: Configuration) {
        this.simplex = new SimplexNoise()
        this.configuration = configuration
        const geometry = new THREE.BufferGeometry()
        this.positions = this.sphereVertices(
            this.configuration.radiusExternal,
            this.configuration.radiusInternal,
            this.configuration.particles
        )
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.positions), 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.configuration.particles * 3), 3))
        if (this.configuration.coronastar) {
            const glowTexture = this.createGlowTexture()
            const material = new THREE.PointsMaterial({
                opacity: 0.5,
                color: 0xaaffff,
                map: glowTexture,
                depthWrite: false,
                transparent: true,
                vertexColors: true,
                sizeAttenuation: true,
                size: this.configuration.size,
                blending: THREE.AdditiveBlending,
            })
            this.base = new THREE.Points(geometry, material)
        } else {
            const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
            const material = new THREE.PointsMaterial({
                opacity: 0.5,
                color: 0x00ffff,
                depthWrite: false,
                transparent: true,
                sizeAttenuation: true,
                clipIntersection: false,
                size: this.configuration.size,
                clippingPlanes: [clippingPlane],
                blending: THREE.AdditiveBlending,
            })
            this.base = new THREE.Points(geometry, material)
        }
        this.base.position.set(0, 0, 0)
        this.base.rotation.z = this.configuration.angle ?? 0.0
    }

    public animate(time: number): void {
        const buffer1 = this.base.geometry.getAttribute('position') as THREE.BufferAttribute
        const color1 = this.base.geometry.getAttribute('color') as THREE.BufferAttribute
        for (let i = 0; i < this.configuration.particles; i++) {
            this.noise(
                buffer1,
                color1,
                this.positions,
                this.configuration.delta ? time * this.configuration.delta : time,
                i
            )
        }
        buffer1.needsUpdate = true
        color1.needsUpdate = true
    }

    private noise(
        buffer: THREE.BufferAttribute,
        colorBuffer: THREE.BufferAttribute,
        positions: Float32Array,
        time: number,
        index: number
    ): void {
        const i3 = index * 3

        // Posição base (original da esfera)
        const bx = positions[i3 + 0]!
        const by = positions[i3 + 1]!
        const bz = positions[i3 + 2]!

        // 1. Ruído para o deslocamento Vertical (Radial - Para fora)
        const noiseVertical = this.simplex.noise4d(
            bx * this.configuration.noiseFactor,
            by * this.configuration.noiseFactor,
            bz * this.configuration.noiseFactor,
            time
        )
        const offsetVertical = (noiseVertical * 0.5 + 0.5) * this.configuration.noiseScale

        // Vetor normalizado a partir do centro (direção para fora)
        const length = Math.sqrt(bx * bx + by * by + bz * bz) || 1
        const nx = bx / length
        const ny = by / length
        const nz = bz / length

        // 2. ADICIONANDO O EFEITO HORIZONTAL (Tangencial)
        // Criamos um segundo ruído defasado no tempo para que o movimento horizontal 
        // não seja idêntico ao vertical (evitando movimentos puramente diagonais rígidos)
        const noiseHorizontal = this.simplex.noise4d(
            bx * this.configuration.noiseFactor,
            by * this.configuration.noiseFactor,
            bz * this.configuration.noiseFactor,
            time + 50.0 // Defasagem temporal para aleatoriedade
        )

        // Intensidade do balanço horizontal (pode criar uma propriedade na Configuration se quiser)
        const horizontalScale = this.configuration.noiseTangentialScale ?? this.configuration.noiseScale
        const offsetHorizontal = noiseHorizontal * horizontalScale * 0.3

        // Direção Horizontal: Criamos um vetor tangente à superfície da esfera.
        // Uma forma simples é cruzar a normal com o eixo "Up" (0, 1, 0)
        let tx = -ny
        let ty = nx
        let tz = 0

        // Caso a partícula esteja exatamente no topo (rápida correção matemática)
        if (Math.abs(nz) > 0.99) {
            tx = 1; ty = 0; tz = 0;
        }

        // Normaliza o vetor tangente para garantir consistência
        const tLength = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1
        tx /= tLength
        ty /= tLength
        tz /= tLength

        // 3. Aplicação combinada dos dois deslocamentos
        // final = Posição Base + (Empurrão para Fora) + (Balanço Lateral)
        const finalX = bx + (nx * offsetVertical) + (tx * offsetHorizontal)
        const finalY = by + (ny * offsetVertical) + (ty * offsetHorizontal)
        const finalZ = bz + (nz * offsetVertical) + (tz * offsetHorizontal)

        buffer.setXYZ(index, finalX, finalY, finalZ)

        // Brilho baseado na proximidade de Z a 0 (mantido o seu original)
        const falloff = 1.0
        const brightness = Math.pow(Math.max(0, 1.0 - Math.abs(finalZ) / falloff), 2)
        colorBuffer.setXYZ(index, brightness, brightness, brightness)
    }

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