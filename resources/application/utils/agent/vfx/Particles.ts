import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

export default class Particles {
    private readonly scene: THREE.Scene
    private readonly numParticles: number
    private readonly simplex: SimplexNoise
    private readonly particleNoisePoints1: THREE.Points
    private readonly particleNoisePoints2: THREE.Points
    private readonly particleNoisePositions1: Float32Array
    private readonly particleNoisePositions2: Float32Array

    public constructor() {
        this.numParticles = 4096
        this.scene = new THREE.Scene()
        this.simplex = new SimplexNoise()
        const glowTexture = this.createGlowTexture()

        const material = new THREE.PointsMaterial({
            size: 0.05,
            opacity: 0.5,
            color: 0xaaffff,
            map: glowTexture,
            depthWrite: false,
            transparent: true,
            vertexColors: true,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
        })

        const sphereGeometry1 = new THREE.BufferGeometry()
        const sphereGeometry2 = new THREE.BufferGeometry()

        this.particleNoisePositions1 = this.sphereVertices(2.0, 1.9, this.numParticles)
        this.particleNoisePositions2 = this.sphereVertices(1.7, 1.5, this.numParticles)

        sphereGeometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.particleNoisePositions1), 3))
        sphereGeometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.particleNoisePositions2), 3))
        sphereGeometry1.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.numParticles * 3), 3))
        sphereGeometry2.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.numParticles * 3), 3))
        this.particleNoisePoints1 = new THREE.Points(sphereGeometry1, material)
        this.particleNoisePoints2 = new THREE.Points(sphereGeometry2, material)
        this.particleNoisePoints1.position.set(0, 0, 0)
        this.particleNoisePoints2.position.set(0, 0, 0)
        this.scene.add(this.particleNoisePoints1)
        this.scene.add(this.particleNoisePoints2)
    }

    public getScene(): THREE.Scene {
        return this.scene
    }

    public animate(time: number): void {
        const buffer1 = this.particleNoisePoints1.geometry.getAttribute('position') as THREE.BufferAttribute
        const color1 = this.particleNoisePoints1.geometry.getAttribute('color') as THREE.BufferAttribute
        for (let i = 0; i < this.numParticles; i++) {
            this.noise(buffer1, color1, this.particleNoisePositions1, 0.4, 0.6, time, i)
        }
        buffer1.needsUpdate = true
        color1.needsUpdate = true

        const buffer2 = this.particleNoisePoints2.geometry.getAttribute('position') as THREE.BufferAttribute
        const color2 = this.particleNoisePoints2.geometry.getAttribute('color') as THREE.BufferAttribute
        for (let i = 0; i < this.numParticles; i++) {
            this.noise(buffer2, color2, this.particleNoisePositions2, 0.2, 0.4, time, i)
        }
        buffer2.needsUpdate = true
        color2.needsUpdate = true
    }

    private noise(
        buffer: THREE.BufferAttribute,
        colorBuffer: THREE.BufferAttribute,
        positions: Float32Array,
        noiseFactor: number,
        noiseScale: number,
        time: number,
        index: number
    ): void {
        const i3 = index * 3

        // posicao base
        const bx = positions[i3 + 0]!
        const by = positions[i3 + 1]!
        const bz = positions[i3 + 2]!

        // Calculo do deslocamento coerente (onda)
        // Usamos noise * 0.5 + 0.5 para que o deslocamento seja sempre para fora,
        // evitando que as particulas "entrem" na esfera e causem visual de succao.
        const noise = this.simplex.noise4d(
            bx * noiseScale,
            by * noiseScale,
            bz * noiseScale,
            time * 0.4
        )
        const offset = (noise * 0.5 + 0.5) * noiseFactor

        // Vetor normalizado a partir do centro
        const length = Math.sqrt(bx * bx + by * by + bz * bz) || 1
        const nx = bx / length
        const ny = by / length
        const nz = bz / length

        // Aplicacao do deslocamento apenas para fora
        const finalX = bx + nx * offset
        const finalY = by + ny * offset
        const finalZ = bz + nz * offset
        buffer.setXYZ(index, finalX, finalY, finalZ)

        // Brilho baseado na proximidade de Z a 0 (equador da esfera)
        // O raio máximo é ~2.0, então usamos isso para o decaimento
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
                if (distXY >= internalRadius) {
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