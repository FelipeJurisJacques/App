import Type from '../../enumeratos/events/type'
import Listener from '../../utils/events/listener'

export default class Button extends HTMLElement {
    private static listener: Listener | null = null

    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        shadow.innerHTML = '<style>:host(:hover) { cursor: pointer; }</style><slot></slot>'
        if (Button.listener === null) {
            Button.listener = new Listener(Type.ACTION, 'widget-button[type=link]', event => {
                const action = event.target.getAttribute('action')
                if (action) {
                    const method = event.target.getAttribute('method') || 'GET'
                    const target = event.target.getAttribute('target') || 'self'
                    switch (method) {
                        case 'GET':
                            switch (target) {
                                case 'self':
                                    window.open(action, '_self')
                                    break
                                case 'blank':
                                    window.open(action, '_blank')
                                    break
                                case 'parent':
                                    window.open(action, '_parent')
                                    break
                                case 'top':
                                    window.open(action, '_top')
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
    }
}