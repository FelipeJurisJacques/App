import * as THREE from 'three'
import State from './enumerator/State'

export default class Parallax {
    private state: State
    private resize: () => void
    private readonly canvas: HTMLCanvasElement
    private readonly observer: MutationObserver
    private readonly renderer: THREE.WebGLRenderer
    private readonly camera: THREE.PerspectiveCamera
    private orientation: (event: DeviceOrientationEvent) => void
    public readonly scenes: Array<(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => void>

    public constructor(canvas: HTMLCanvasElement) {
        this.scenes = []
        this.canvas = canvas
        this.state = State.IDLE
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: this.canvas,
        })
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        const element = window.document.body.querySelector('p.data')
        this.orientation = event => {
            const roll = event.gamma
            const pitch = event.beta
            const alpha = event.alpha
            if (roll && alpha && pitch && element) {
                // em teste
                element.innerHTML = `${Math.trunc(roll)}, ${Math.trunc(pitch)}, ${Math.trunc(alpha)}`
            }
        }
        this.resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        }
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.removedNodes.forEach(removed => {
                    if (removed === this.canvas) {
                        this.renderer.dispose()
                        window.removeEventListener('resize', this.resize)
                        if (this.state === State.TRACKING) {
                            window.removeEventListener('deviceorientation', this.orientation)
                        }
                        this.state = State.INTERRUPTED
                        this.observer.disconnect()
                    }
                })
            })
        })
    }

    public handler(): void {
        if (this.canvas.parentNode) {
            this.state = State.RUNNING
            this.camera.position.z = 4.5
            this.renderer.autoClear = false
            this.renderer.localClippingEnabled = true
            window.addEventListener('resize', this.resize)
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.observer.observe(this.canvas.parentNode, {
                childList: true,
            })
            try {
                const deviceOrientation = window.DeviceOrientationEvent as any
                if (
                    deviceOrientation
                    && typeof deviceOrientation.requestPermission === 'function'
                ) {
                    const promise = deviceOrientation.requestPermission() as Promise<string>
                    promise.then(result => {
                        if (result === 'granted') {
                            this.state = State.TRACKING
                            window.addEventListener('deviceorientation', this.orientation)
                        }
                    }).catch(error => {
                        console.error(error)
                    })
                } else {
                    this.state = State.TRACKING
                    window.addEventListener('deviceorientation', this.orientation)
                }
            } catch (error) {
                console.error(error)
            }
            this.animate()
        }
    }

    private animate(): void {
        if (this.state === State.RUNNING || this.state === State.TRACKING) {
            for (let scene of this.scenes) {
                scene(this.renderer, this.camera)
            }
            requestAnimationFrame(() => this.animate())
        }
    }
}