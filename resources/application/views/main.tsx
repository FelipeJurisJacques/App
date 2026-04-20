import View from './view'
import * as THREE from 'three'
import Agent from '../utils/agent/Agent'
import CustomShape from '../components/CustomShape'
import Stylesheet from '../../stylesheets/views/main.css'
import ThemeDark from '../../graphics/buttons/ThemeDark.svg'
import ThemeLight from '../../graphics/buttons/ThemeLight.svg'
import ThemeHighContrast from '../../graphics/buttons/ThemeHighContrast.svg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Main extends View {
    private theme: string
    private allowCameraRotation = true

    public constructor() {
        super(true)
        this.theme = window.localStorage.getItem('theme') || 'dark'
        this.applyTheme()
    }

    private applyTheme(): void {
        switch (this.theme) {
            case 'light':
                window.document.documentElement.style.setProperty('--theme', 'light')
                window.document.documentElement.style.setProperty('--font-color', '#32514E')
                window.document.documentElement.style.setProperty('--primary-color', '#E0E0E0')
                break
            case 'high-contrast':
                window.document.documentElement.style.setProperty('--theme', 'high-contrast')
                window.document.documentElement.style.setProperty('--font-color', '#000000')
                window.document.documentElement.style.setProperty('--primary-color', '#FFFFFF')
                break
            case 'dark':
            default:
                window.document.documentElement.style.setProperty('--theme', 'dark')
                window.document.documentElement.style.setProperty('--font-color', '#E0E0E0')
                window.document.documentElement.style.setProperty('--primary-color', '#32514E')
                break
        }
    }

    private toggleTheme(): void {
        const button = this.shadow.querySelector('button[type="button"]') as HTMLButtonElement
        button.innerHTML = ''
        switch (this.theme) {
            case 'light':
                this.theme = 'high-contrast'
                button.append(ThemeHighContrast)
                break
            case 'high-contrast':
                this.theme = 'dark'
                button.append(ThemeDark)
                break
            case 'dark':
                this.theme = 'light'
                button.append(ThemeLight)
                break
        }
        window.localStorage.setItem('theme', this.theme)
        this.applyTheme()
    }

    private getThemeColor(): string {
        switch (this.theme) {
            case 'light':
                return '#E0E0E0'
            case 'high-contrast':
                return '#FFFFFF'
            case 'dark':
            default:
                return '#32514E'
        }
    }

    public render(): Element[] {
        this.shadow.adoptedStyleSheets = [
            Stylesheet,
        ]
        return [
            <canvas id="agent-canvas"></canvas>,
            <custom-shape>
                <p class="top">
                    00:00:00
                </p>
                <button type="button">
                    {
                        this.theme === 'light' ? ThemeLight :
                            this.theme === 'high-contrast' ? ThemeHighContrast :
                                ThemeDark
                    }
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

            let controls: OrbitControls | undefined
            if (this.allowCameraRotation) {
                controls = new OrbitControls(camera, renderer.domElement)
                controls.enableDamping = true
                controls.dampingFactor = 0.05
                controls.screenSpacePanning = false
            }

            const agent = new Agent()

            renderer.autoClear = false
            const animate = () => {
                requestAnimationFrame(animate)
                agent.animate()
                if (controls) controls.update()
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