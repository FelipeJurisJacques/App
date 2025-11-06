export default abstract class Theread {
    public static loop(ms: number, event: Function): number {
        event()
        return window.setInterval(event, ms)
    }

    public static stop(id: number): void {
        window.clearInterval(id)
    }
}