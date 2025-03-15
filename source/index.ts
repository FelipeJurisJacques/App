import { Agent } from "./helpers/Agent"
import Svg from "./helpers/components/Svg"
import Body from "./helpers/components/Body"
import Object from "./helpers/components/Object"
import Document from "./helpers/components/Document"
// @ts-ignore
import * as THREE from "./libs/three/three.module.js"
import Application from "./helpers/Application"
import Canvas from "./helpers/components/Canvas"
import VectorialScalable from "./helpers/styles/VectorialScalable"
import Vector2 from "./utils/Vector2"
import Render from "./helpers/events/Render"

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

export function listenResize(helper: any) {
    try {
        helper.invokeMethodAsync('SetSize', window.innerWidth, window.innerHeight)
        window.addEventListener('resize', () => {
            helper.invokeMethodAsync('OnResize', window.innerWidth, window.innerHeight)
            if (renderer) {
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(0, -2, 0)
                camera.lookAt(new THREE.Vector3(0, 0, 0))
                renderer.setSize(window.innerWidth, window.innerHeight)
            }
        })
    } catch (error) {
        console.error(error)
        throw error
    }
}

export function initializeAgent(helper: any): Agent {
    try {
        renderer = new THREE.WebGLRenderer({
            canvas: document.body.querySelector('#background') as HTMLCanvasElement,
            antialias: true
        })
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, -2, 0)
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        renderer.setSize(window.innerWidth, window.innerHeight)
        animate()
        return agent
    } catch (error) {
        console.error(error)
        throw error
    }
}

declare global {
    interface Window {
        agent: Agent
        listenResize: typeof listenResize
        initializeAgent: typeof initializeAgent
    }
}

window.agent = agent
window.listenResize = listenResize
window.initializeAgent = initializeAgent

const app = new Application()
app.render(new Document({
    children: [
        new Body({
            children: [
                new Canvas({
                    width: 100,
                    height: 100,
                }),
                new Object({
                    onRender: function (event: Render) {
                        const element = event.target
                        const width = element.transform.width
                        const mw = width / 2
                        const clip = new VectorialScalable(width, 50)
                        const paths: Vector2[][] = []
                        let path: Vector2[] = []
                        path.push(new Vector2(0, 15))
                        path.push(new Vector2(mw - 170, 15))
                        path.push(new Vector2(mw - 160, 5))
                        path.push(new Vector2(mw - 50, 5))
                        path.push(new Vector2(mw - 40, 15))
                        path.push(new Vector2(mw + 40, 15))
                        path.push(new Vector2(mw + 50, 5))
                        path.push(new Vector2(mw + 160, 5))
                        path.push(new Vector2(mw + 170, 15))
                        path.push(new Vector2(width, 15))
                        path.push(new Vector2(width, 50))
                        path.push(new Vector2(0, 50))
                        path.push(new Vector2(0, 15))
                        paths.push(path)

                        path = []
                        for (let i = 0; i < 50; i += 2) {
                            path.push(new Vector2(0, i))
                            path.push(new Vector2(width, i))
                            path.push(new Vector2(width, i + 1))
                            path.push(new Vector2(0, i + 1))
                            path.push(new Vector2(0, i))
                        }
                        paths.push(path)
                        clip.addPolygon(paths, '#1a1a1a')

                        path = []
                        path.push(new Vector2(0, 15))
                        path.push(new Vector2(mw - 170, 15))
                        path.push(new Vector2(mw - 160, 5))
                        path.push(new Vector2(mw - 50, 5))
                        path.push(new Vector2(mw - 40, 15))
                        path.push(new Vector2(mw + 40, 15))
                        path.push(new Vector2(mw + 50, 5))
                        path.push(new Vector2(mw + 160, 5))
                        path.push(new Vector2(mw + 170, 15))
                        path.push(new Vector2(width, 15))
                        path.push(new Vector2(width, 17))
                        path.push(new Vector2(mw + 169, 17))
                        path.push(new Vector2(mw + 159, 7))
                        path.push(new Vector2(mw + 51, 7))
                        path.push(new Vector2(mw + 41, 17))
                        path.push(new Vector2(mw - 41, 17))
                        path.push(new Vector2(mw - 51, 7))
                        path.push(new Vector2(mw - 159, 7))
                        path.push(new Vector2(mw - 169, 17))
                        path.push(new Vector2(0, 17))
                        path.push(new Vector2(0, 15))
                        clip.addPolygon(path, '#00f2ff')
                        this.data = `data:image/svg+xml;base64,${btoa(clip.toString())}`
                    }
                }),
            ],
        })
    ],
}))