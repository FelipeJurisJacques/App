import View from '../views/view'
import Stylesheet from '../../stylesheets/components/CustomShape.css'

interface Polygon {
    color: string
    points: Array<[number, number]>
}

/**
 * Componente CustomShape
 * Encapsula um canvas que se auto-redesenha ao redimensionar a tag.
 * Utiliza Shadow DOM e a técnica de Layering para manter o canvas como background.
 */
export default class CustomShape extends View {
    private static sheet: CSSStyleSheet
    private observer: ResizeObserver | null = null
    private canvas: HTMLCanvasElement | null = null
    private tasks: Array<() => void> = []

    public constructor() {
        super(true)
        this.tasks = []
        if (!CustomShape.sheet) {
            CustomShape.sheet = new CSSStyleSheet()
            CustomShape.sheet.replace(Stylesheet)
        }
        this.shadow.adoptedStyleSheets = [
            CustomShape.sheet,
        ]
    }

    public get width(): number {
        return this.canvas?.width || 0
    }

    public get height(): number {
        return this.canvas?.height || 0
    }

    public polygon(task: () => Polygon): void {
        this.tasks.push(() => {
            const { color, points } = task()
            if (!this.canvas) return
            const ctx = this.canvas.getContext('2d')
            if (!ctx) return
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.moveTo(points[0][0], points[0][1])
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1])
            }
            ctx.closePath()
            ctx.fill()
        })
        this.handler()
    }

    public handler(): void {
        if (!this.canvas) return
        const rect = this.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        // Ajusta a resolução interna do canvas para evitar borrões
        this.canvas.width = rect.width * dpr
        this.canvas.height = rect.height * dpr

        const ctx = this.canvas.getContext('2d')
        if (!ctx) return

        const width = this.canvas.width
        const height = this.canvas.height

        // Limpa o canvas
        ctx.clearRect(0, 0, width, height)

        this.tasks.forEach((draw) => {
            draw()
        })
    }

    /**
     * Renderiza a estrutura do componente
     */
    public render(): Element[] {
        this.canvas = <canvas id="background-canvas"></canvas> as HTMLCanvasElement
        return [
            this.canvas,
            <div class="content-slot">
                <slot></slot>
            </div>
        ]
    }

    /**
     * Chamado quando o elemento é conectado ao DOM
     */
    public override connectedCallback(): void {
        super.connectedCallback()
        if (this.canvas) {
            this.observer = new ResizeObserver(() => this.handler())
            this.observer.observe(this)
            this.handler()
        }
    }

    /**
     * Chamado quando o elemento é desconectado do DOM
     */
    public override disconnectedCallback(): void {
        if (this.observer) {
            this.observer.disconnect()
            this.observer = null
        }
        super.disconnectedCallback()
    }
}

// Registro do Custom Element
window.customElements.define('custom-shape', CustomShape)
