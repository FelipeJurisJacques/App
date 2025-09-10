enum Type {
    NONE,
    ACTION,
}

class Listner {
    private view: View
    private type: Type
    private query: string
    private event: ((event: Event) => void) | null

    public constructor(view: View, query: string) {
        this.view = view
        this.event = null
        this.query = query
        this.type = Type.NONE
    }

    public onAction(event: ((event: Event) => void)): void {
        this.push(Type.ACTION, event)
    }

    public notify(event: Event): void {
        switch (this.type) {
            case Type.ACTION:
                if (event.type === 'click') {
                    this.handler(event)
                }
                break
            case Type.NONE:
            default:
                break
        }
    }

    private push(type: Type, event: ((event: Event) => void)): void {
        this.type = type
        this.event = event
        this.view.listners.push(this)
    }

    private handler(event: Event): void {
        if (
            this.event
            && event.target
            && event.target instanceof HTMLElement
            && this.view.contains(event.target)
            && event.target.closest(this.query)
        ) {
            this.event(event)
        }
    }
}

export default class View extends HTMLElement {
    public listners: Array<Listner>
    private static views: Array<View> = []
    private static documents: Array<Document> = []

    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        shadow.innerHTML = '<slot></slot>'
        this.listners = []
    }

    public listen(query: string): Listner {
        return new Listner(this, query)
    }

    public connectedCallback(): void {
        View.views.push(this)
        for (let document of View.documents) {
            if (document === this.ownerDocument) {
                return
            }
        }
        this.ownerDocument.addEventListener('click', event => {
            for (let listner of this.listners) {
                if (listner instanceof Listner) {
                    try {
                        listner.notify(event)
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        })
        View.documents.push(this.ownerDocument)
    }

    public disconnectedCallback(): void {
        this.listners.length = 0
    }
}