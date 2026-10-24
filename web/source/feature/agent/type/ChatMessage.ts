export default interface ChatMessage {
    text: string;
    sender: "user" | "bot";
}