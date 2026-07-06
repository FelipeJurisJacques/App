import View from './View'
import * as THREE from 'three'
import Agent from '../utils/agent/Agent'
import CustomShape from '../components/CustomShape'
import Stylesheet from '../../stylesheets/views/main.css'
import FolderIcon from '../../graphics/buttons/Folder.svg'
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
                window.document.documentElement.style.colorScheme = 'light'
                break
            case 'high-contrast':
                window.document.documentElement.style.colorScheme = 'light'
                break
            case 'dark':
            default:
                window.document.documentElement.style.colorScheme = 'dark'
                break
        }
        window.document.documentElement.setAttribute('theme', this.theme)
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

    public render(): Element[] {
        this.shadow.adoptedStyleSheets = [
            Stylesheet,
        ]
        return [
            <canvas id="agent-canvas"></canvas>,
            <custom-shape>
                <p class="top"></p>
                <button type="button" class="theme">
                    {
                        this.theme === 'light' ? ThemeLight :
                            this.theme === 'high-contrast' ? ThemeHighContrast :
                                ThemeDark
                    }
                </button>
                <button type="button" class="files">
                    {FolderIcon}
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
            camera.position.z = 7.0

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
        const themeButton = this.shadow.querySelector('button.theme')
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
                    points: path,
                    color: getComputedStyle(window.document.documentElement).getPropertyValue('--primary-color'),
                }
            })

            // bottom
            shape.polygon(() => {
                const top = shape.height - 50
                const center = shape.width / 2.0
                return {
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
                    color: getComputedStyle(window.document.documentElement).getPropertyValue('--primary-color'),
                }
            })
        }

        const files = this.shadow.querySelector('button.files') as HTMLButtonElement
        if (files) {
            files.addEventListener('click', event => {
                event.preventDefault()
                const container = window.document.querySelector('#container')
                if (container) {
                    container.innerHTML = ''
                    container.append(<view-files></view-files>)
                }
            })
        }

        const top = this.shadow.querySelector('p.top') as HTMLElement
        if (top) {
            const time = function () {
                const theme = window.document.documentElement.getAttribute('theme')
                if (theme === 'high-contrast') {
                    top.innerText = new Date().toLocaleTimeString().substring(0, 5)
                } else {
                    top.innerText = new Date().toLocaleTimeString()
                }
            }
            time()
            setInterval(time, 1000)
        }
    }
}

window.customElements.define('view-main', Main)