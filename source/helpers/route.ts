import View from '../utils/view'

export default class Route {
    private static routes: { path: string; view: typeof View }[] = []
    private static view: View | null = null

    public static push<T extends typeof View>(path: string, view: T): void {
        Route.routes.push({ path, view })
        Route.check()
    }

    private static check(): void {
        const route = this.routes.find(r => r.path === window.location.pathname)
        if (
            route
            && route.view !== View
            && Object.getPrototypeOf(route.view) === View
            && (!Route.view || Route.view instanceof route.view)
        ) {
            if (Route.view) {
                Route.view.destroy()
            }
            window.document.querySelectorAll('widget-view').forEach(element => element.remove())
            Route.build(route.view)
            // window.document.body.insertAdjacentHTML(
            //     'beforeend',
            //     '<script type="module" src="dist/application.mjs" async></script>'
            // )
        }
    }

    private static build(view: any): void {
        const element = window.document.createElement('widget-view')
        window.document.body.appendChild(element)
        const instance = new view(element)
        Route.view = instance
        element.innerHTML = instance.render()
        instance.handler()
    }
}