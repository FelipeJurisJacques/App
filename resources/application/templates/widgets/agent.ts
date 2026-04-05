import Agent from '../../helpers/agent.js'
import Widget from '../../abstracts/widget'
import Template from '../../helpers/Template'
// @ts-ignore
import * as THREE from './libs/three/three.module.js'
import Stylesheet from '../../enumeratos/assets/stylesheet'

export default class Bar extends Widget {
    private readonly agent: Agent
    private camera: THREE.PerspectiveCamera
    private readonly renderer: THREE.WebGLRendere

    protected async build(): Promise<string> {
        return `
            ${await Template.stylesheet(Stylesheet.WIDGET_BAR)}
            <slot></slot>
            <div class="bacground">
                <div class="customization"></div>
            </div>
        `
    }
}