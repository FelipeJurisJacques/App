import Stylesheet from './Files.css'
import Window from '../support/window/Window'

export default class Files extends Window {
    private static stylesheet: null | CSSStyleSheet = null

    public constructor() {
        super({
            stylesheet: () => {
                if (!Files.stylesheet) {
                    Files.stylesheet = new Stylesheet()
                }
                return [Files.stylesheet]
            }
        })
    }

    protected render(): void {
        this.element.append(<h1>Files_Explorer</h1>)
        const openBtn = <button>Open Directory</button> as HTMLButtonElement
        openBtn.addEventListener('click', () => {
            window.initFileSystem?.()
        })
        this.element.append(openBtn)
        this.element.append(<div class="content">
            <p>Click "Open Directory" to initialize the file system.</p>
        </div>)
    }

    protected handler(): void {
        window.addEventListener('vfs-ready', () => {
            this.renderTree()
        })
    }

    private async renderTree(): Promise<void> {
        const root = window.__vfsRoot
        const content = this.element.querySelector('.content')
        if (!content) return

        if (!root) {
            content.replaceChildren(<p>Waiting for file system initialization...</p>)
            return
        }

        content.replaceChildren(<p>Loading...</p>)

        try {
            const tree = await this.buildTree(root, '/')
            content.replaceChildren(tree)
        } catch (err) {
            content.replaceChildren(<p>Failed to read directory: {String(err)}</p>)
        }
    }

    private async buildTree(
        dirHandle: FileSystemDirectoryHandle,
        path: string
    ): Promise<HTMLElement> {
        const ul = <ul class="vfs-tree"></ul> as HTMLElement

        const entries: { name: string; kind: 'file' | 'directory'; handle: FileSystemHandle }[] = []
        for await (const [name, handle] of (dirHandle as any).entries()) {
            entries.push({ name, kind: handle.kind, handle })
        }

        entries.sort((a, b) => {
            if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
            return a.name.localeCompare(b.name)
        })

        for (const entry of entries) {
            const li = <li></li> as HTMLElement
            const fullPath = path === '/' ? `/${entry.name}` : `${path}/${entry.name}`

            if (entry.kind === 'directory') {
                const toggle = <span class="vfs-dir">📁 {entry.name}/</span> as HTMLElement
                toggle.style.cursor = 'pointer'
                li.append(toggle)

                const childContainer = <div class="vfs-children" style="display:none;"></div> as HTMLElement
                li.append(childContainer)

                let expanded = false
                toggle.addEventListener('click', async () => {
                    if (!expanded) {
                        const childTree = await this.buildTree(
                            entry.handle as FileSystemDirectoryHandle,
                            fullPath
                        )
                        childContainer.replaceChildren(childTree)
                        childContainer.style.display = ''
                        expanded = true
                    } else {
                        childContainer.style.display = childContainer.style.display === 'none' ? '' : 'none'
                    }
                })
            } else {
                li.append(<span class="vfs-file">📄 {entry.name}</span>)
            }

            ul.append(li)
        }

        if (entries.length === 0) {
            ul.append(<li><em>empty</em></li>)
        }

        return ul
    }
}

window.customElements.define('view-files', Files)
