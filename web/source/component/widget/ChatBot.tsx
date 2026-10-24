import Stylesheet from "./ChatBot.css";
import View from "../../support/view/View";
import Agent from "../../feature/agent/Agent";
import Parallax from "../../feature/parallax/Parallax";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class ChatBot extends View {
    private theme: string;
    private static stylesheet: null | CSSStyleSheet = null;

    public constructor() {
        super({
            stylesheet: () => {
                if (!ChatBot.stylesheet) {
                    ChatBot.stylesheet = new Stylesheet();
                }
                return [ChatBot.stylesheet];
            },
        });
        this.theme = window.localStorage.getItem("theme") || "dark";
    }

    protected render(): void {
        this.element.append(<div id="history"></div>);
        this.element.append(<canvas id="agent"></canvas>);
        this.element.append(<form id="conversation" autocomplete="off">
            <input type="text" name="chat" placeholder="Digite sua mensagem..." />
            <button type="submit">Enviar</button>
        </form>);
    }

    protected handler(): void {
        const history = this.element.querySelector(
            "#history",
        ) as HTMLDivElement | null;
        const form = this.element.querySelector(
            "#conversation",
        ) as HTMLFormElement | null;
        const chat = form?.querySelector(
            '[name="chat"]',
        ) as HTMLInputElement | null;
        const canvas = this.element.querySelector(
            "#agent",
        ) as HTMLCanvasElement | null;
        if (chat && form && canvas && history) {
            const agent = new Agent();
            try {
                const parallax = new Parallax(canvas);
                // let controls: OrbitControls | undefined
                // parallax.scenes.push((renderer, camera) => {
                //     if (!controls) {
                //         controls = new OrbitControls(camera, renderer.domElement)
                //         controls.enableDamping = true
                //         controls.dampingFactor = 0.05
                //         controls.screenSpacePanning = false
                //     }
                //     controls.update()
                // })
                parallax.scenes.push((renderer, camera) => {
                    agent.animate();
                    renderer.render(agent.getScenes(this.theme), camera);
                });
                parallax.handler();
            } catch (error) {
                console.error(error)
            }

            const appendMessage = (message: { sender: string; text: string }) => {
                const existing = Array.from(history.children).find(
                    (el) => el.textContent === (message.sender === "bot" ? `Bot: ${message.text}` : `Você: ${message.text}`)
                );
                if (existing) {
                    existing.textContent = message.sender === "bot" ? `Bot: ${message.text}` : `Você: ${message.text}`;
                    return;
                }

                if (message.sender === "bot") {
                    history.append(<p class="bot-message">
                        Bot: {message.text}
                    </p>);
                } else {
                    history.append(<p class="user-message">
                        Você: {message.text}
                    </p>);
                }
                history.scrollTop = history.scrollHeight;
            };

            agent.setHandler(message => {
                appendMessage(message);
                if (message.sender === "bot") {
                    chat.disabled = false;
                    chat.focus();
                    if (!message.text.startsWith("Baixando modelo") && !message.text.startsWith("Modelo LLM") && !message.text.startsWith("Falha ao carregar")) {
                        agent.speak(message.text);
                    }
                }
            });

            form.addEventListener("submit", (event: Event) => {
                event.preventDefault();
                const text = chat.value.trim();
                if (text && !chat.disabled) {
                    chat.value = "";
                    chat.disabled = true;
                    agent.generateReply(text);
                }
            });
        }
    }

    // private initLLM(history: HTMLDivElement): void {
    //     if (this.llmReady || this.llmLoading) return;
    //     this.llmLoading = true;
    //     this.messages.push({
    //         sender: "bot",
    //         text: "Baixando modelo... O assistente continuará respondendo localmente enquanto isso.",
    //     });
    //     this.history(history);
    //     const engine = new webLLM.MLCEngine();
    //     engine.setInitProgressCallback((report: webLLM.InitProgressReport) => {
    //         this.llmProgress = Math.round(report.progress * 100);
    //         const loadingMsg = this.messages.find((m) =>
    //             m.text.startsWith("Baixando modelo"),
    //         );
    //         if (loadingMsg) {
    //             loadingMsg.text = `Baixando modelo... ${this.llmProgress}%`;
    //             this.history(history);
    //         }
    //     });
    //     engine
    //         .reload(this.llmModelId)
    //         .then(() => {
    //             this.llmEngine = engine;
    //             this.llmReady = true;
    //             this.llmLoading = false;
    //             const loadingIdx = this.messages.findIndex((m) =>
    //                 m.text.startsWith("Baixando modelo"),
    //             );
    //             if (loadingIdx !== -1) {
    //                 this.messages[loadingIdx] = {
    //                     sender: "bot",
    //                     text: "Modelo LLM carregado! Agora responderei diretamente no navegador.",
    //                 };
    //             }
    //             this.history(history);
    //         })
    //         .catch((err: unknown) => {
    //             console.error("Erro ao carregar modelo LLM:", err);
    //             this.llmLoading = false;
    //             const loadingIdx = this.messages.findIndex((m) =>
    //                 m.text.startsWith("Baixando modelo"),
    //             );
    //             if (loadingIdx !== -1) {
    //                 this.messages[loadingIdx] = {
    //                     sender: "bot",
    //                     text: "Falha ao carregar o modelo LLM. Continuando com ElizaBot.",
    //                 };
    //             }
    //             this.history(history);
    //         });
    // }

    // private async generateReply(userText: string): Promise<string> {
    //     if (this.llmReady && this.llmEngine && !this.llmGenerating) {
    //         this.llmGenerating = true;
    //         this.conversationHistory.push({ role: "user", content: userText });
    //         try {
    //             console.log("[LLM Debug] Iniciando geração de resposta...");
    //             console.log("[LLM Debug] Histórico enviado:", JSON.stringify(this.conversationHistory, null, 2));
    //             console.log("[LLM Debug] Chamando chat.completions.create com stream:true...");

    //             const chunks = await this.llmEngine.chat.completions.create({
    //                 messages: this
    //                     .conversationHistory as webLLM.ChatCompletionMessageParam[],
    //                 max_tokens: 512,
    //                 temperature: 0.7,
    //                 stream: true,
    //             });

    //             console.log("[LLM Debug] create() retornou. Tipo:", typeof chunks, "| Constructor:", (chunks as object)?.constructor?.name);
    //             console.log("[LLM Debug] chunks tem Symbol.asyncIterator?", Symbol.asyncIterator in (chunks as object));

    //             let raw = "";
    //             let tokenCount = 0;
    //             const startTime = performance.now();

    //             console.log("[LLM Debug] Entrando no for await...");

    //             // Itera sobre os tokens via streaming
    //             for await (const chunk of chunks as AsyncIterable<{ choices?: { delta?: { content?: string }; finish_reason?: string }[] }>) {
    //                 console.log("[LLM Debug] Chunk recebido:", JSON.stringify(chunk));
    //                 const delta = chunk.choices?.[0]?.delta?.content || "";
    //                 const finishReason = chunk.choices?.[0]?.finish_reason;

    //                 if (delta) {
    //                     tokenCount++;
    //                     raw += delta;
    //                     console.log(`[LLM Debug] Token #${tokenCount}: "${delta}"`);
    //                 }

    //                 if (finishReason) {
    //                     console.log(`[LLM Debug] Stream finalizado. Motivo: ${finishReason}`);
    //                 }
    //             }

    //             console.log("[LLM Debug] Saiu do for await.");

    //             const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    //             console.log(`[LLM Debug] Geração concluída. Total de tokens: ${tokenCount} | Tempo: ${elapsed}s | Tokens/s: ~${(tokenCount / parseFloat(elapsed)).toFixed(1)}`);
    //             console.log("[LLM Debug] Resposta bruta acumulada:", raw);
    //             const cleaned = raw.replace(/<\|[^|]*\|>/g, "").trim();
    //             const reply = cleaned || "Não consegui gerar uma resposta.";
    //             this.conversationHistory.push({ role: "assistant", content: reply });
    //             if (this.conversationHistory.length > 21) {
    //                 this.conversationHistory = [
    //                     this.conversationHistory[0],
    //                     ...this.conversationHistory.slice(-20),
    //                 ];
    //             }
    //             this.llmGenerating = false;
    //             return reply;
    //         } catch (err) {
    //             console.error("Erro na inferência LLM:", err);
    //             this.conversationHistory.pop();
    //             this.llmGenerating = false;
    //             console.log("[LLM Debug] Usando fallback ElizaBot após erro LLM.");
    //             const elizaReply = this.bot.transform(userText);
    //             console.log("[LLM Debug] Resposta ElizaBot:", elizaReply);
    //             return elizaReply;
    //         }
    //     }
    //     console.log("[LLM Debug] Usando fallback ElizaBot. LLM pronto:", this.llmReady, "| Gerando:", this.llmGenerating);
    //     const elizaReply = this.bot.transform(userText);
    //     console.log("[LLM Debug] Resposta ElizaBot:", elizaReply);
    //     return elizaReply;
    // }
}

window.customElements.define("component-chat-bot", ChatBot);
