import View from '../infrastructure/View'
import Stylesheet from './CustomShape.css'

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
    private tasks: Array<() => void> = []
    private observer: ResizeObserver | null = null
    private styleObserver: MutationObserver | null = null
    private canvas: HTMLCanvasElement | null = null
    private static dpr: number = window.devicePixelRatio || 1

    public constructor() {
        super(true)
        this.tasks = []
        this.shadow.adoptedStyleSheets = [
            Stylesheet,
        ]
    }

    public get width(): number {
        const dpr = CustomShape.dpr
        return this.canvas ? this.canvas.width / dpr : 0
    }

    public get height(): number {
        const dpr = CustomShape.dpr
        return this.canvas ? this.canvas.height / dpr : 0
    }

    public polygon(task: () => Polygon): void {
        this.tasks.push(() => {
            const dpr = CustomShape.dpr
            const { color, points } = task()
            if (!this.canvas) return
            const ctx = this.canvas.getContext('2d')
            if (!ctx) return
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.moveTo(points[0]![0] * dpr, points[0]![1] * dpr)
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i]![0] * dpr, points[i]![1] * dpr)
            }
            ctx.closePath()
            ctx.fill()
        })
        this.handler()
    }

    public handler(): void {
        if (!this.canvas) return
        const dpr = CustomShape.dpr
        const rect = this.getBoundingClientRect()

        // Ajusta a resolução interna do canvas para evitar borrões
        const width = rect.width * dpr
        const height = rect.height * dpr

        this.canvas.width = width
        this.canvas.height = height

        const ctx = this.canvas.getContext('2d')
        if (!ctx) return


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

            this.styleObserver = new MutationObserver(() => this.handler())
            this.styleObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: [
                    'style',
                    'class',
                    'theme',
                ]
            })

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
        if (this.styleObserver) {
            this.styleObserver.disconnect()
            this.styleObserver = null
        }
        super.disconnectedCallback()
    }
}

// Registro do Custom Element
window.customElements.define('custom-shape', CustomShape)
