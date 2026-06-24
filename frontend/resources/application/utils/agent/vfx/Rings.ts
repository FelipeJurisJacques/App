import * as THREE from 'three'

export default class Rings {
    private readonly ring1: THREE.Mesh
    private readonly ring2: THREE.Mesh
    private readonly ring3: THREE.Mesh
    private readonly ring4: THREE.Mesh
    private readonly ring5: THREE.Mesh
    private readonly ring6: THREE.Mesh
    private readonly ring7: THREE.Mesh
    private readonly scene: THREE.Scene
    private readonly ringSegments: THREE.Mesh[] = []

    public constructor() {
        this.ringSegments = []
        this.scene = new THREE.Scene()
        const ringGroup = new THREE.Group()
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
        this.scene.add(ringGroup)

        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        })
        let geometry = new THREE.RingGeometry(
            0.8, // innerRadius
            0.85, // outerRadius
            16, // thetaSegments
            1, // phiSegments
            0, // thetaStart
            Math.PI / 2 // thetaEnd
        )
        this.ring1 = new THREE.Mesh(geometry, material)
        this.ring1.userData.angle = 0
        this.scene.add(this.ring1)

        geometry = new THREE.RingGeometry(
            0.85, // innerRadius
            0.9, // outerRadius
            8, // thetaSegments
            1, // phiSegments
            Math.PI / 4, // thetaStart
            Math.PI / 4 // thetaEnd
        )
        this.ring2 = new THREE.Mesh(geometry, material)
        this.ring2.userData.angle = 0
        this.scene.add(this.ring2)

        geometry = new THREE.RingGeometry(
            0.9, // innerRadius
            0.95, // outerRadius
            16, // thetaSegments
            1, // phiSegments
            Math.PI / 2, // thetaStart
            Math.PI / 2 // thetaEnd
        )
        this.ring3 = new THREE.Mesh(geometry, material)
        this.ring3.userData.angle = 0
        this.scene.add(this.ring3)

        geometry = new THREE.RingGeometry(
            0.95, // innerRadius
            1.0, // outerRadius
            8, // thetaSegments
            1, // phiSegments
            Math.PI, // thetaStart
            Math.PI / 4 // thetaEnd
        )
        this.ring4 = new THREE.Mesh(geometry, material)
        this.ring4.userData.angle = 0
        this.scene.add(this.ring4)

        geometry = new THREE.RingGeometry(
            1.0, // innerRadius
            1.05, // outerRadius
            16, // thetaSegments
            1, // phiSegments
            0, // thetaStart
            Math.PI / 2 // thetaEnd
        )
        this.ring5 = new THREE.Mesh(geometry, material)
        this.ring5.userData.angle = 0
        this.scene.add(this.ring5)

        geometry = new THREE.RingGeometry(
            1.05, // innerRadius
            1.1, // outerRadius
            16, // thetaSegments
            1, // phiSegments
            Math.PI / 2, // thetaStart
            Math.PI / 2 // thetaEnd
        )
        this.ring6 = new THREE.Mesh(geometry, material)
        this.ring6.userData.angle = 0
        this.scene.add(this.ring6)

        geometry = new THREE.RingGeometry(
            1.1, // innerRadius
            1.15, // outerRadius
            8, // thetaSegments
            1, // phiSegments
            Math.PI, // thetaStart
            Math.PI / 4 // thetaEnd
        )
        this.ring7 = new THREE.Mesh(geometry, material)
        this.ring7.userData.angle = 0
        this.scene.add(this.ring7)
    }

    public getScene(): THREE.Scene {
        return this.scene
    }

    public animate(time: number): void {
        this.ring1.rotation.z += 0.002
        this.ring2.rotation.z -= 0.002
        this.ring3.rotation.z += 0.001
        this.ring4.rotation.z -= 0.001
        this.ring5.rotation.z -= 0.0025
        this.ring6.rotation.z += 0.0025
        this.ring7.rotation.z -= 0.0015

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