import Util from '../utils/route'

export default abstract class Route {
    private static routes: Util[] = []
    private static current: null | Util = null
    private static displaying: null | HTMLElement

    public static go(path: string): void {
        for (let route of Route.routes) {
            if (route !== Route.current && route.checkPath(path)) {
                console.info(`ROUTE: ${path}`)
                Route.render(route)
                window.history.pushState({}, '', path)
                break
            }
        }
    }

    public static push(
        path: string | string[],
        render: (documento: Document) => HTMLElement
    ): void {
        const util = new Util(typeof path === 'string' ? [path] : path, render)
        Route.routes.push(util)
        Route.check()
    }

    public static checkPath(path: string): boolean {
        for (let route of Route.routes) {
            if (route.checkPath(path)) {
                return true
            }
        }
        return false
    }

    private static check(): void {
        const path = window.location.pathname
        for (let route of Route.routes) {
            if (route !== Route.current && route.checkPath(path)) {
                console.info(`ROUTE: ${path}`)
                Route.render(route)
                break
            }
        }
    }

    private static render(route: Util): void {
        Route.current = route
        if (Route.displaying && Route.displaying.isConnected) {
            Route.displaying.remove()
        }
        const element = route.build(window.document)
        Route.displaying = element
        document.body.append(element)
        // window.document.body.insertAdjacentHTML(
        //     'beforeend',
        //     '<script type="module" src="dist/application.mjs" async></script>'
        // )
    }
}

window.addEventListener('popstate', event => {
    if (event.target instanceof Window) {
        Route.go(event.target.location.pathname)
    }
})