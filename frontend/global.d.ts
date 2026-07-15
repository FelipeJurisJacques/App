declare module '*.svg' {
    export default class {
        public toString(): string
    }
}

declare module '*.css' {
    export default class extends CSSStyleSheet {
        constructor()
    }
}

declare namespace JSX {
    interface Element extends HTMLElement { }
    interface IntrinsicElements {
        [elemName: string]: {
            id?: string
            class?: string
            className?: string
            [propName: string]: any
            style?: string | Partial<CSSStyleDeclaration>
        }
    }
}