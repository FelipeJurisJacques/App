import Widget from './widget'
import Route from '../helpers/route'
import Target from '../utils/events/target'
import Signature from '../utils/events/signature'

export default abstract class View extends Widget {
    protected abstract handler(): void

    public constructor() {
        super(true)
        this.listen('widget-button').onAction(event => {
            const action = event.target.getAttribute('action')
            if (action) {
                const method = event.target.getAttribute('method') || 'GET'
                const target = event.target.getAttribute('target') || 'self'
                switch (method) {
                    case 'GET':
                        switch (target) {
                            case 'top':
                                window.open(action, '_top')
                                break
                            case 'self':
                                if (Route.checkPath(action)) {
                                    Route.go(action)
                                } else {
                                    window.open(action, '_self')
                                }
                                break
                            case 'blank':
                                window.open(action, '_blank')
                                break
                            case 'parent':
                                window.open(action, '_parent')
                                break
                            case 'popup':
                                const width = event.target.getAttribute('width') || '600'
                                const height = event.target.getAttribute('height') || '400'
                                window.open(action, '_blank', `
                                    status=no,
                                    toolbar=no,
                                    menubar=no,
                                    location=no,
                                    resizable=yes,
                                    scrollbars=yes,
                                    left=100,top=100,
                                    width=${width},height=${height}
                                `)
                                break
                            default:
                                break
                        }
                        break
                    default:
                        break
                }
            }
        })
    }

    public connectedCallback(): void {
        this.handler()
    }

    protected listen(query: string) {
        const target = new Target(this)
        target.onQuery(query)
        return new Signature(target)
    }
}