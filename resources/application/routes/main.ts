import Agent from '../utils/Agent'
import Theread from '../helpers/theread'
import View from '../../../engine/utils/view'
// @ts-ignore
import * as THREE from './libs/three/three.module'
import Builder from '../../../engine/utils/builder'

const agent = new Agent()
let renderer: null | THREE.WebGLRendere = null
let camera: null | THREE.PerspectiveCamera = null

function animate(): void {
    if (renderer) {
        agent.animate()
        renderer.render(agent.Scene, camera)
    }
    requestAnimationFrame(animate)
}

export default class Main extends View {
    private loop: null | number

    public constructor() {
        super([
            '/',
            '/index.html'
        ], document => {
            let icon: Builder
            switch (window.localStorage.getItem('theme') ?? 'dark') {
                case 'light':
                    icon = new Builder({ tag: 'icon-light' })
                    document.body.setAttribute('theme', 'light')
                    break
                case 'high_contrast':
                    icon = new Builder({ tag: 'icon-high-contrast' })
                    document.body.setAttribute('theme', 'high_contrast')
                    break
                default:
                    icon = new Builder({ tag: 'icon-dark' })
                    document.body.setAttribute('theme', 'dark')
                    break
            }
            return new Builder({
                tag: 'div',
                attributes: {
                    id: 'container',
                },
                children: [
                    new Builder({
                        tag: 'widget-top',
                    }),
                    new Builder({
                        tag: 'widget-bar',
                        children: [
                            new Builder({
                                child: icon,
                                attributes: {
                                    class: 'theme'
                                },
                                tag: 'widget-button',
                            }),
                            new Builder({
                                tag: 'widget-button',
                                attributes: {
                                    class: 'calendar',
                                    type: 'link',
                                    action: '/calendar'
                                },
                                child: new Builder({
                                    tag: 'icon-calendar',
                                })
                            })
                        ]
                    })
                ]
            })
        })
    }

    protected handler(): void {
        const top = this.root.querySelector('widget-top')
        if (top) {
            this.loop = Theread.loop(60000, () => {
                const date = new Date()
                top.innerHTML = `
                    ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
                    <br>
                    ${date.toLocaleDateString()}
                `
            })
        }
        const theme = this.root.querySelector('widget-button.theme')
        if (theme) {
            this.listen('widget-button.theme').onAction(() => {
                switch (window.localStorage.getItem('theme') ?? 'dark') {
                    case 'light':
                        theme.innerHTML = '<icon-high-contrast />'
                        window.localStorage.setItem('theme', 'high_contrast')
                        this.root.ownerDocument.body.setAttribute('theme', 'high_contrast')
                        break
                    case 'high_contrast':
                        theme.innerHTML = '<icon-dark />'
                        window.localStorage.setItem('theme', 'dark')
                        this.root.ownerDocument.body.setAttribute('theme', 'dark')
                        break
                    default:
                        theme.innerHTML = '<icon-light />'
                        window.localStorage.setItem('theme', 'light')
                        this.root.ownerDocument.body.setAttribute('theme', 'light')
                        break
                }
            })
        }
        renderer = new THREE.WebGLRenderer({
            canvas: document.body.querySelector('#background') as HTMLCanvasElement,
            antialias: true
        })
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, -2, 0)
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        renderer.setSize(window.innerWidth, window.innerHeight)
        animate()
    }

    public destroy(): void {
        if (this.loop) {
            Theread.stop(this.loop)
            this.loop = null
        }
    }
}