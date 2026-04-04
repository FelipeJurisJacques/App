/**
 * Domain Specific Language (DLS) de HyperText Markup Language (HTML)
 */
export const HyperTextMarkupLanguage = {
    create(tag: string, props: any, ...children: any[]) {
        const element = window.document.createElement(tag)
        if (props) {
            for (const key in props) {
                element.setAttribute(key, props[key])
            }
        }
        if (children) {
            for (const child of children) {
                if (typeof child === 'string') {
                    element.insertAdjacentText('beforeend', child)
                } else {
                    element.appendChild(child)
                }
            }
        }
        return element
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any
        }
        interface Element extends globalThis.Element { }
    }
    const HyperTextMarkupLanguage: any;
}