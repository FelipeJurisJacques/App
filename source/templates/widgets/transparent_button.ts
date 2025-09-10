import Button from './button'

export default class TransparentButton extends Button {
    public constructor() {
        super()
        this.insertAdjacentHTML('beforeend', `
            <style>
                button {
                    background-color: transparent;
                }
            </style>
        `)
    }
}