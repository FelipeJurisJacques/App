import * as THREE from "three";
import Scene from "./type/Scene";
import SceneDark from "./hook/SceneDark";
import SceneLight from "./hook/SceneLight";
import ChatMessage from "./type/ChatMessage";
import ChatService from "./service/ChatService";
import SceneHighContrast from "./hook/SceneHighContrast";

export default class Agent {
    private loaded: boolean;
    private intensity: number;
    private annimation: null | Scene;
    private readonly chat: ChatService;

    public constructor() {
        this.loaded = false;
        this.intensity = 0.0;
        this.annimation = null;
        this.chat = new ChatService(
            "SmolLM2-135M-Instruct-q0f32-MLC",
            "Você é um assistente amigável chamado SmolBot. Responda de forma concisa e natural em português brasileiro."
        );
    }

    public setHandler(handler: (message: ChatMessage) => void) {
        const message = this.chat.getInitialMessage()
        if (message) {
            handler(message)
        }
    }

    public async generateReply(message: string): Promise<void> {
        if (!this.loaded) {
            await this.chat.loadLLM()
        }
        this.chat.generateReply(message)
    }

    public getScenes(theme: string): THREE.Scene {
        switch (theme) {
            case "dark":
                if (!this.annimation || !(this.annimation instanceof SceneDark)) {
                    this.annimation = new SceneDark();
                }
                break;
            case "light":
                if (!this.annimation || !(this.annimation instanceof SceneLight)) {
                    this.annimation = new SceneLight();
                }
                break;
            default:
                if (
                    !this.annimation ||
                    !(this.annimation instanceof SceneHighContrast)
                ) {
                    this.annimation = new SceneHighContrast();
                }
                break;
        }
        return this.annimation.scene;
    }

    public speak(message: string): void {
        this.intensity = 1.0;
        setTimeout(() => {
            this.intensity = 0.0;
        }, 100 * message.length);
        if ("speechSynthesis" in window) {
            try {
                const speak = new SpeechSynthesisUtterance(message);
                speak.rate = 2;
                speak.pitch = 1;
                speak.volume = 1;
                window.speechSynthesis.speak(speak);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.warn("Narrador não compatível com o navegador.");
        }
    }

    public animate(): void {
        if (this.annimation) {
            this.annimation.intensity = this.intensity;
            this.annimation.animate();
        }
    }
}
