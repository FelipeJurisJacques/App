import * as THREE from "three"
import Place from "./scene/Place"

export default class Cultivation {
  private resize: () => void
  private readonly place: Place
  private readonly canvas: HTMLCanvasElement
  private readonly observer: MutationObserver
  private readonly renderer: THREE.WebGLRenderer
  private readonly camera: THREE.PerspectiveCamera
  public readonly scenes: Array<
    (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => void
  >

  public constructor(canvas: HTMLCanvasElement) {
    this.scenes = []
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas,
    })
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    this.place = new Place(this.camera, this.renderer)
    this.resize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((removed) => {
          if (removed === this.canvas) {
            this.renderer.dispose()
            window.removeEventListener("resize", this.resize)
            this.observer.disconnect()
          }
        })
      })
    })
  }

  public handler(): void {
    if (this.canvas.parentNode) {
      this.camera.position.y = 8.0
      this.camera.position.z = -12.0
      this.renderer.autoClear = false
      this.renderer.localClippingEnabled = true
      window.addEventListener("resize", this.resize)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.observer.observe(this.canvas.parentNode, {
        childList: true,
      })
      this.animate()
    }
  }

  private animate(): void {
    for (let scene of this.scenes) {
      scene(this.renderer, this.camera)
    }
    this.place.update()
    requestAnimationFrame(() => this.animate())
  }
}
