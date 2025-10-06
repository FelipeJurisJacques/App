import View from '../utils/view'
import Util from '../utils/route'

export default class Route {
    private static routes: Util[] = []
    private static displaying: View | null = null

    public static push(path: string, view: typeof View): void {
        for (const route of Route.routes) {
            if (view === route.view) {
                if (!route.paths.includes(path)) {
                    route.paths.push(path)
                    Route.check()
                    return
                }
            }
        }
        Route.routes.push(new Util(view, [path]))
        Route.check()
    }

    private static check(): void {
        const path = window.location.pathname
        for (let route of Route.routes) {
            if (route.paths.find(p => p === path)) {
                if (Route.displaying) {
                    Route.displaying.destroy()
                }
                Route.displaying = route.build()
                // window.document.body.insertAdjacentHTML(
                //     'beforeend',
                //     '<script type="module" src="dist/application.mjs" async></script>'
                // )
            }
        }
    }
}