/**
 * Domain Specific Language (DLS) de HyperText Markup Language (HTML)
 */
export class Web {
    public static create(tag: string, props: any, ...children: any[]) {
        const element = window.document.createElement(tag)
        if (props) {
            for (const key in props) {
                element.setAttribute(key, props[key])
            }
        }
        if (children) {
            for (const child of children) {
                if (tag === 'style' && child instanceof HTMLElement) {
                    element.textContent += Web.toCSS(child)
                } else if (typeof child === 'string') {
                    element.insertAdjacentText('beforeend', child)
                } else {
                    element.appendChild(child)
                }
            }
        }
        return element
    }

    /**
     * Converte um elemento e seus filhos em uma string CSS (Nesting)
     */
    private static toCSS(element: HTMLElement): string {
        let selector = element.tagName.toLowerCase()
        if (element.id) selector += `#${element.id}`
        if (element.className) selector += `.${element.className.split(/\s+/).filter(Boolean).join('.')}`
        let css = `${selector} {\n`
        for (const attr of Array.from(element.attributes)) {
            const { name, value } = attr
            if (name !== 'id' && name !== 'class') {
                css += `    ${name}: ${value};\n`
            }
        }
        for (const child of Array.from(element.childNodes)) {
            if (child instanceof HTMLElement) {
                css += Web.toCSS(child).split('\n').map(line => `    ${line}`).join('\n') + '\n'
            } else if (child.nodeType === Node.TEXT_NODE) {
                css += `    ${child.textContent}\n`
            }
        }
        css += '}\n'
        return css
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any
        }
        interface Element extends globalThis.Element { }
    }
    const Web: any
}