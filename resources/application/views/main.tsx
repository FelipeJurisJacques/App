import View from './view'
import * as THREE from 'three'
import Agent from '../utils/Agent'
import CustomShape from '../components/CustomShape'
import Stylesheet from '../../stylesheets/views/main.css'

export default class Main extends View {
    private themes = ['dark', 'light', 'high-contrast']
    private themeIndex = 0

    public constructor() {
        super(true)
        const savedTheme = window.localStorage.getItem('theme') || 'dark'
        this.themeIndex = this.themes.indexOf(savedTheme)
        if (this.themeIndex === -1) this.themeIndex = 0
        this.applyTheme()
    }

    private applyTheme(): void {
        const theme = this.themes[this.themeIndex]!
        document.body.setAttribute('theme', theme)
        window.localStorage.setItem('theme', theme)
    }

    private toggleTheme(): void {
        this.themeIndex = (this.themeIndex + 1) % this.themes.length
        this.applyTheme()
        // Repintar o componente para atualizar as cores do custom-shape
        this.handler()
    }

    private getThemeColor(): string {
        const theme = this.themes[this.themeIndex]
        if (theme === 'dark') return '#071F1F'
        return '#E0E0E0' // Light and High-Contrast
    }
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
                <button type="button">
                    tema
                </button>
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
        const themeButton = this.shadow.querySelector('button[type="button"]')
        if (themeButton) {
            themeButton.addEventListener('click', () => this.toggleTheme())
        }

        const shape = this.shadow.querySelector('custom-shape') as CustomShape
        if (shape) {

            // top
            shape.polygon(() => {
                const step = 10.0
                const start = 25.0
                const height = 40.0
                const path: Array<[number, number]> = []
                path.push([0, 0])
                for (let i = 0; i < 20; i++) {
                    let size = Math.round(1.0 * (i * 0.3 + 1.0))
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
                    color: this.getThemeColor(),
                    points: path,
                }
            })

            // bottom
            shape.polygon(() => {
                const top = shape.height - 50
                const center = shape.width / 2.0
                return {
                    color: this.getThemeColor(),
                    points: [
                        [0, top],
                        [Math.min(center - 128, 10), top],
                        [Math.min(center - 138, 20), top - 10],
                        [center - 50, top - 10],
                        [center - 40, top],
                        [center + 40, top],
                        [center + 50, top - 10],
                        [Math.max(center + 138, shape.width - 20), top - 10],
                        [Math.max(center + 128, shape.width - 10), top],
                        [shape.width, top],
                        // [shape.width, shape.height],
                        // [0, shape.height],
                        // [0, top],
                        [shape.width, top - 2],
                        [Math.max(center + 128, shape.width - 10), top - 2],
                        [Math.max(center + 138, shape.width - 20), top - 12],
                        [center + 50, top - 12],
                        [center + 40, top - 2],
                        [center - 40, top - 2],
                        [center - 50, top - 12],
                        [Math.min(center - 138, 20), top - 12],
                        [Math.min(center - 128, 10), top - 2],
                        [0, top - 2],
                        [0, top],
                    ],
                }
            })
        }
    }
}

window.customElements.define('view-main', Main)