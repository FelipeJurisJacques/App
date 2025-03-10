import Document from "./components/Document"

export default class Application {
    private window: Window

    public constructor(context?: Window) {
        this.window = context ? context : window
    }

    public render(document: Document): void {
        document.render(this.window)
    }
}