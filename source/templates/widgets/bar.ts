export default class Bar extends HTMLElement {
    public constructor() {
        super()
        const shadow = this.attachShadow({
            mode: 'closed',
        })
        shadow.innerHTML = `
            <slot></slot>
            <link rel="stylesheet" href="assets/stylesheet/widgets/bar.css">
            <div class="bacground">
                <div class="customization"></dv>
            </div>
        `
    }
}