import ElizaBot from "./Eliza";
import ChatMessage from "../type/ChatMessage";
import LargeLanguageModel from "../support/LargeLanguageModel";

export default class ChatService {
    private readonly bot: ElizaBot;
    private readonly llm: LargeLanguageModel;
    private readonly messages: ChatMessage[];

    public constructor(modelId: string, systemPrompt?: string) {
        this.messages = [];
        this.bot = new ElizaBot();
        this.llm = new LargeLanguageModel(modelId, systemPrompt);
    }

    public getMessages(): ChatMessage[] {
        return this.messages;
    }

    public getInitialMessage(): ChatMessage | null {
        const initial = this.bot.getInitial();
        if (initial) {
            const message: ChatMessage = {
                sender: "bot",
                text: initial,
            }
            this.messages.push(message);
            return message
        } else {
            return null;
        }
    }

    public onLLMProgress(callback: (progress: number) => void): void {
        this.llm.setProgressCallback(callback);
    }

    public onLLMStatusChange(
        callback: (status: "loading" | "ready" | "error") => void,
    ): void {
        this.llm.setStatusCallback(callback);
    }

    public async loadLLM(): Promise<void> {
        this.messages.push({
            sender: "bot",
            text: "Baixando modelo... O assistente continuará respondendo localmente enquanto isso.",
        });
        try {
            await this.llm.load();
            const loadingIdx = this.messages.findIndex((m) =>
                m.text.startsWith("Baixando modelo"),
            );
            if (loadingIdx !== -1) {
                this.messages[loadingIdx] = {
                    sender: "bot",
                    text: "Modelo LLM carregado! Agora responderei diretamente no navegador.",
                };
            }
        } catch {
            const loadingIdx = this.messages.findIndex((m) =>
                m.text.startsWith("Baixando modelo"),
            );
            if (loadingIdx !== -1) {
                this.messages[loadingIdx] = {
                    sender: "bot",
                    text: "Falha ao carregar o modelo LLM. Continuando com ElizaBot.",
                };
            }
        }
    }

    public updateLoadingProgress(progress: number): void {
        const loadingMsg = this.messages.find((m) =>
            m.text.startsWith("Baixando modelo"),
        );
        if (loadingMsg) {
            loadingMsg.text = `Baixando modelo... ${progress}%`;
        }
    }

    public async generateReply(userText: string): Promise<ChatMessage> {
        this.messages.push({
            sender: "user",
            text: userText,
        });

        let reply: string;

        if (this.llm.isReady() && !this.llm.isGenerating()) {
            try {
                reply = await this.llm.generate(userText);
            } catch (err) {
                console.error("Erro na inferência LLM:", err);
                reply = this.bot.transform(userText);
            }
        } else {
            reply = this.bot.transform(userText);
        }

        const message: ChatMessage = {
            text: reply,
            sender: "bot",
        }
        this.messages.push(message);
        return message;
    }
}