import * as webLLM from "@mlc-ai/web-llm";

export interface LLMProgressCallback {
    (progress: number): void;
}

export interface LLMStatusCallback {
    (status: "loading" | "ready" | "error"): void;
}

export default class LargeLanguageModel {
    private ready: boolean;
    private loading: boolean;
    private generating: boolean;
    private readonly model: string;
    private onProgress: LLMProgressCallback | null;
    private onStatusChange: LLMStatusCallback | null;
    private engine: null | webLLM.MLCEngineInterface;
    private conversationHistory: { role: string; content: string }[];

    public constructor(
        model: string,
        systemPrompt?: string,
    ) {
        this.model = model;
        this.ready = false;
        this.loading = false;
        this.generating = false;
        this.engine = null;
        this.onProgress = null;
        this.onStatusChange = null;
        this.conversationHistory = [
            {
                role: "system",
                content:
                    systemPrompt ||
                    "Você é um assistente amigável. Responda de forma concisa e natural em português brasileiro.",
            },
        ];
    }

    public setProgressCallback(callback: LLMProgressCallback): void {
        this.onProgress = callback;
    }

    public setStatusCallback(callback: LLMStatusCallback): void {
        this.onStatusChange = callback;
    }

    public isReady(): boolean {
        return this.ready;
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public isGenerating(): boolean {
        return this.generating;
    }

    public async load(): Promise<void> {
        console.log("[LLM] load() called", { ready: this.ready, loading: this.loading });
        if (this.ready || this.loading) return;
        this.loading = true;
        console.log("[LLM] Starting model load:", this.model);
        this.onStatusChange?.("loading");

        const engine = new webLLM.MLCEngine();
        engine.setInitProgressCallback((report: webLLM.InitProgressReport) => {
            const progress = Math.round(report.progress * 100);
            this.onProgress?.(progress);
        });

        try {
            await engine.reload(this.model);
            this.engine = engine;
            this.ready = true;
            this.loading = false;
            console.log("[LLM] Model loaded successfully");
            this.onStatusChange?.("ready");
        } catch (err) {
            console.error("[LLM] Failed to load model:", err);
            this.loading = false;
            this.onStatusChange?.("error");
            throw err;
        }
    }

    public async generate(userText: string): Promise<string> {
        console.log("[LLM] generate() called", { ready: this.ready, hasEngine: !!this.engine, generating: this.generating });
        if (!this.ready || !this.engine || this.generating) {
            console.warn("[LLM] Cannot generate - not ready:", { ready: this.ready, hasEngine: !!this.engine, generating: this.generating });
            throw new Error("LLM not ready");
        }

        this.generating = true;
        this.conversationHistory.push({ role: "user", content: userText });
        console.log("[LLM] Generating response for:", userText.substring(0, 50) + (userText.length > 50 ? "..." : ""));

        try {
            const chunks = await this.engine.chat.completions.create({
                messages: this
                    .conversationHistory as webLLM.ChatCompletionMessageParam[],
                max_tokens: 512,
                temperature: 0.7,
                stream: true,
            });

            let raw = "";
            let chunkCount = 0;

            for await (const chunk of chunks as any) {
                chunkCount++;
                const delta = chunk.choices?.[0]?.delta?.content;
                if (delta) {
                    raw += delta;
                }
                if (chunk.choices?.[0]?.finish_reason) {
                    console.log("[LLM] Stream finished, reason:", chunk.choices[0].finish_reason);
                    break;
                }
            }

            console.log("[LLM] Received", chunkCount, "chunks, raw length:", raw.length);

            const cleaned = raw.replace(/<\|[^|]*\|>/g, "").trim();
            const reply = cleaned || "Não consegui gerar uma resposta.";
            console.log("[LLM] Generated reply:", reply.substring(0, 100) + (reply.length > 100 ? "..." : ""));
            this.conversationHistory.push({ role: "assistant", content: reply });

            if (this.conversationHistory.length > 21) {
                this.conversationHistory = [
                    this.conversationHistory[0],
                    ...this.conversationHistory.slice(-20),
                ];
            }

            this.generating = false;
            return reply;
        } catch (err) {
            console.error("[LLM] Error during generation:", err);
            this.conversationHistory.pop();
            this.generating = false;
            throw err;
        }
    }
}