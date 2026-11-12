import Stylesheet from './Note.css'
import Tesseract from 'tesseract.js'
import Window from '../support/window/Window'

export default class Note extends Window {
    private static stylesheet: null | CSSStyleSheet = null
    private isDrawing = false
    private canvas!: HTMLCanvasElement
    private ctx!: CanvasRenderingContext2D
    private statusEl!: HTMLElement
    private outputEl!: HTMLElement
    private penColorInput!: HTMLInputElement
    private penSizeInput!: HTMLInputElement

    public constructor() {
        super({
            stylesheet: () => {
                if (!Note.stylesheet) {
                    Note.stylesheet = new Stylesheet()
                }
                return [Note.stylesheet]
            }
        })
    }

    protected render(): void {
        this.element.append(
            <div class="toolbar">
                <label>Cor: <input type="color" value="#000000" /></label>
                <label>Tamanho: <input type="range" min="1" max="20" value="3" /></label>
                <button type="button" class="secondary" id="btn-clear">Limpar</button>
                <button type="button" class="action" id="btn-ocr">Reconhecer Texto</button>
                <span class="status">Pronto.</span>
            </div>,
            <canvas width="650" height="350"></canvas>,
            <div class="output">O texto aparecerá aqui...</div>
        )

        this.canvas = this.element.querySelector('canvas')!
        this.ctx = this.canvas.getContext('2d')!
        this.statusEl = this.element.querySelector('.status')!
        this.outputEl = this.element.querySelector('.output')!
        this.penColorInput = this.element.querySelector('input[type="color"]')!
        this.penSizeInput = this.element.querySelector('input[type="range"]')!

        this.initCanvas()
    }

    protected handler(): void {
        this.canvas.addEventListener('mousedown', (e) => this.startDraw(e))
        this.canvas.addEventListener('mousemove', (e) => this.draw(e))
        this.canvas.addEventListener('mouseup', () => this.stopDraw())
        this.canvas.addEventListener('mouseout', () => this.stopDraw())

        this.canvas.addEventListener('touchstart', (e) => this.startDraw(e), { passive: false })
        this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false })
        this.canvas.addEventListener('touchend', () => this.stopDraw())

        const btnClear = this.element.querySelector('#btn-clear') as HTMLButtonElement
        btnClear.addEventListener('click', () => {
            this.initCanvas()
            this.outputEl.innerText = 'O texto aparecerá aqui...'
            this.statusEl.innerText = 'Pronto.'
        })

        const btnOcr = this.element.querySelector('#btn-ocr') as HTMLButtonElement
        btnOcr.addEventListener('click', async () => {
            await this.processOcr(btnOcr)
        })
    }

    private initCanvas(): void {
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    private getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect()
        const scaleX = this.canvas.width / rect.width
        const scaleY = this.canvas.height / rect.height
        if ('touches' in e && e.touches.length > 0) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            }
        }
        const mouseEvent = e as MouseEvent
        return {
            x: (mouseEvent.clientX - rect.left) * scaleX,
            y: (mouseEvent.clientY - rect.top) * scaleY
        }
    }

    private startDraw(e: MouseEvent | TouchEvent): void {
        this.isDrawing = true
        const pos = this.getPos(e)
        this.ctx.beginPath()
        this.ctx.moveTo(pos.x, pos.y)
    }

    private draw(e: MouseEvent | TouchEvent): void {
        if (!this.isDrawing) return
        e.preventDefault()
        const pos = this.getPos(e)
        this.ctx.lineWidth = Number(this.penSizeInput.value)
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        this.ctx.strokeStyle = this.penColorInput.value
        this.ctx.lineTo(pos.x, pos.y)
        this.ctx.stroke()
    }

    private stopDraw(): void {
        this.isDrawing = false
    }

    private async processOcr(btnOcr: HTMLButtonElement): Promise<void> {
        this.statusEl.innerText = 'Iniciando o reconhecimento...'
        this.outputEl.innerText = ''
        btnOcr.disabled = true

        try {
            const result = await Tesseract.recognize(this.canvas, 'por', {
                logger: (m: { status: string; progress: number }) => {
                    if (m.status === 'recognizing') {
                        this.statusEl.innerText = `Reconhecendo: ${Math.round(m.progress * 100)}%`
                    } else if (m.status === 'loading language traineddata') {
                        this.statusEl.innerText = 'Carregando dados do idioma...'
                    }
                }
            })

            this.statusEl.innerText = 'Concluído!'
            this.outputEl.innerText = result.data.text.trim() || 'Nenhum texto detectado.'
        } catch (error) {
            window.console.error(error)
            this.statusEl.innerText = 'Erro ao processar a imagem.'
        } finally {
            btnOcr.disabled = false
        }
    }
}

window.customElements.define('view-note', Note)
