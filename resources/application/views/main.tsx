import View from './view'
import * as THREE from 'three'
import Agent from '../utils/Agent'
import Stylesheet from '../../stylesheets/main.css'
import CustomShape from '../components/CustomShape'

export default class Main extends View {
    public render(): Element[] {
        const sheet = new CSSStyleSheet()
        sheet.replace(Stylesheet)
        this.shadow.adoptedStyleSheets = [
            sheet,
        ]
        return [
            <canvas id="agent-canvas"></canvas>,
            <custom-shape>
                <p class="top">
                    00:00:00
                </p>
            </custom-shape>
        ]
    }

    public handler(): void {
        const canvas = this.shadow.querySelector('#agent-canvas') as HTMLCanvasElement
        if (canvas) {
            const renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true
            })
            renderer.localClippingEnabled = true
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(window.devicePixelRatio)

            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            )
            camera.position.z = 5

            const agent = new Agent()

            renderer.autoClear = false
            const animate = () => {
                requestAnimationFrame(animate)
                agent.animate()
                renderer.clear()
                for (let scene of agent.getScenes()) {
                    renderer.render(scene, camera)
                }
            }
            animate()

            // agent.speak('Olá, como posso ajudar você hoje?')

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth, window.innerHeight)
            })
        }

        const shape = this.shadow.querySelector('custom-shape') as CustomShape
        if (shape) {

            // top
            shape.polygon(() => {
                const step = 20.0
                const start = 100.0
                const height = 100.0
                const path: Array<[number, number]> = []
                path.push([0, 0])
                for (let i = 0; i < 20; i++) {
                    let size = Math.round(2.0 * (i * 0.3 + 1.0))
                    let center = shape.width / 2
                    path.push([start + center + (i * step + size + 70), 0])
                    path.push([start + center + (i * step + size + 70 + size), 0])
                    path.push([start + center + (i * step + size + 60 + size), height])
                    path.push([start + center + (i * step + size + 60), height])
                    path.push([start + center + (i * step + size + 70), 0])
                    path.push([center - start - (i * step + size + 70), 0])
                    path.push([center - start - (i * step + size + 70 + size), 0])
                    path.push([center - start - (i * step + size + 60 + size), height])
                    path.push([center - start - (i * step + size + 60), height])
                    path.push([center - start - (i * step + size + 70), 0])
                    path.push([start + center + (i * step + size + 70), 0])
                    path.push([center - start - (i * step + size + 70), 0])
                    path.push([center - start - (i * step + size + 70 + size), 0])
                    path.push([center - start - (i * step + size + 60 + size), height])
                    path.push([center - start - (i * step + size + 60), height])
                    path.push([center - start - (i * step + size + 70), 0])
                    path.push([center - start - (i * step + size + 70), 0])
                }
                path.push([0, 0])
                return {
                    color: '#071F1F',
                    points: path,
                }
            })

            // bottom
            shape.polygon(() => {
                const top = shape.height - 50
                const center = shape.width / 2.0
                return {
                    color: '#071F1F',
                    points: [
                        [0, top],
                        [Math.max(center - 230, 10), top],
                        [Math.max(center - 220, 20), top - 10],
                        [center - 50, top - 10],
                        [center - 40, top],
                        [center + 40, top],
                        [center + 50, top - 10],
                        [Math.min(center + 220, shape.width - 20), top - 10],
                        [Math.min(center + 230, shape.width - 10), top],
                        [shape.width, top],
                        // [shape.width, shape.height],
                        // [0, shape.height],
                        // [0, top],
                        [shape.width, top - 2],
                        [Math.min(center + 230, shape.width - 10), top - 2],
                        [Math.min(center + 220, shape.width - 20), top - 12],
                        [center + 50, top - 12],
                        [center + 40, top - 2],
                        [center - 40, top - 2],
                        [center - 50, top - 12],
                        [Math.max(center - 220, 20), top - 12],
                        [Math.max(center - 230, 10), top - 2],
                        [0, top - 2],
                        [0, top],
                    ],
                }
            })
        }
    }
}

window.customElements.define('view-main', Main)