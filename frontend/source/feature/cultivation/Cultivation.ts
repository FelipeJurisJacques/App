import * as THREE from "three"
import Place from "./scene/Place"

export default class Cultivation {
  private readonly place: Place
  private readonly resize: () => void
  private readonly keypressed: Array<string>
  private readonly canvas: HTMLCanvasElement
  private readonly observer: MutationObserver
  private readonly renderer: THREE.WebGLRenderer
  private readonly camera: THREE.PerspectiveCamera
  private readonly keyboard: (event: KeyboardEvent) => void
  public readonly scenes: Array<
    (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => void
  >

  public constructor(canvas: HTMLCanvasElement) {
    this.scenes = []
    this.keypressed = []
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
    this.keyboard = event => {
      switch (event.type) {
        case 'keydown':
          if (!this.keypressed.includes(event.code)) {
            this.keypressed.push(event.code)
          }
          break
        case 'keyup':
          if (this.keypressed.includes(event.code)) {
            this.keypressed.splice(this.keypressed.indexOf(event.code), 1)
          }
          break
      }
      for (let code of this.keypressed) {
        switch (code) {
          case "KeyA":
            this.place.transform.geolocation.longitude -= 0.0000001
            break
          case "KeyD":
            this.place.transform.geolocation.longitude += 0.0000001
            break
          case "KeyS":
            this.place.transform.geolocation.latitude -= 0.0000001
            break
          case "KeyW":
            this.place.transform.geolocation.latitude += 0.0000001
            break
          default:
            break
        }
      }
    }
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((removed) => {
          if (removed === this.canvas) {
            this.renderer.dispose()
            window.removeEventListener('resize', this.resize)
            window.removeEventListener('keyup', this.keyboard)
            window.removeEventListener('keydown', this.keyboard)
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
      window.addEventListener('resize', this.resize)
      window.addEventListener('keyup', this.keyboard)
      window.addEventListener('keydown', this.keyboard)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.observer.observe(this.canvas.parentNode, {
        childList: true,
      })
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(callback => {
          this.place.transform.geolocation = {
            latitude: callback.coords.latitude,
            longitude: callback.coords.longitude,
            altitude: callback.coords.altitude ?? 0.0,
          }
        }, error => {
          console.error(error)
        })
      }
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
