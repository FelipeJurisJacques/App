import Stylesheet from "./Main.css"
import State from "../enumerator/Main"
import View from "../support/view/View"
import Bot from "../component/icon/Bot.svg"
import Folder from "../component/icon/Folder.svg"
import Tractor from "../component/icon/Tractor.svg"
import ThemeDark from "../component/icon/ThemeDark.svg"
import ThemeLight from "../component/icon/ThemeLight.svg"
import CustomShape from "../component/widget/CustomShape"
import ThemeHighContrast from "../component/icon/ThemeHighContrast.svg"

export default class Main extends View {
  private state: State
  private theme: string

  public constructor() {
    super({
      opened: true,
      stylesheet: () => [new Stylesheet()],
    })
    this.state = State.NONE
    this.theme = window.localStorage.getItem("theme") || "dark"
    this.applyTheme()
  }

  private applyTheme(): void {
    switch (this.theme) {
      case "light":
        window.document.documentElement.style.colorScheme = "light"
        break
      case "high-contrast":
        window.document.documentElement.style.colorScheme = "light"
        break
      case "dark":
      default:
        window.document.documentElement.style.colorScheme = "dark"
        break
    }
    window.document.documentElement.setAttribute("theme", this.theme)
  }

  private toggleTheme(): void {
    const button = this.element.querySelector(
      "button[type=\"button\"]",
    ) as HTMLButtonElement
    button.innerHTML = ""
    switch (this.theme) {
      case "light":
        this.theme = "high-contrast"
        button.innerHTML = `${new ThemeHighContrast()}`
        break
      case "high-contrast":
        this.theme = "dark"
        button.innerHTML = `${new ThemeDark()}`
        break
      case "dark":
        this.theme = "light"
        button.innerHTML = `${new ThemeLight()}`
        break
    }
    window.localStorage.setItem("theme", this.theme)
    this.applyTheme()
  }

  protected render(): void {
    this.element.append(
      <component-custom-shape>
        <p class="top"></p>
        <button type="button" class="theme">
          {this.theme === "light"
            ? new ThemeLight()
            : this.theme === "high-contrast"
              ? new ThemeHighContrast()
              : new ThemeDark()}
        </button>
        <button type="button" class="files">
          {new Folder()}
        </button>
        <button type="button" class="cultivation">
          {new Tractor()}
        </button>
        <button type="button" class="chat-bot">
          {new Bot()}
        </button>
      </component-custom-shape>,
    );
    switch (window.location.hash) {
      case "#files":
        window.document.body.append(<view-files></view-files>)
        break
      case "#cultivation":
        window.document.body.append(<view-cultivation></view-cultivation>)
        break
      default:
        break
    }
  }

  protected handler(): void {
    const shape = this.element.querySelector("component-custom-shape") as CustomShape
    if (shape) {
      // top
      shape.polygon(() => {
        const step = 10.0;
        const start = 25.0;
        const height = 40.0;
        const path: Array<[number, number]> = [];
        path.push([0, 0]);
        for (let i = 0; i < 20; i++) {
          let size = Math.round(1.0 * (i * 0.3 + 1.0));
          let center = shape.width / 2;
          path.push([start + center + (i * step + size + 70), 0]);
          path.push([start + center + (i * step + size + 70 + size), 0]);
          path.push([start + center + (i * step + size + 60 + size), height]);
          path.push([start + center + (i * step + size + 60), height]);
          path.push([start + center + (i * step + size + 70), 0]);
          path.push([center - start - (i * step + size + 70), 0]);
          path.push([center - start - (i * step + size + 70 + size), 0]);
          path.push([center - start - (i * step + size + 60 + size), height]);
          path.push([center - start - (i * step + size + 60), height]);
          path.push([center - start - (i * step + size + 70), 0]);
          path.push([start + center + (i * step + size + 70), 0]);
          path.push([center - start - (i * step + size + 70), 0]);
          path.push([center - start - (i * step + size + 70 + size), 0]);
          path.push([center - start - (i * step + size + 60 + size), height]);
          path.push([center - start - (i * step + size + 60), height]);
          path.push([center - start - (i * step + size + 70), 0]);
          path.push([center - start - (i * step + size + 70), 0]);
        }
        path.push([0, 0]);
        return {
          points: path,
          color: getComputedStyle(
            window.document.documentElement,
          ).getPropertyValue("--primary-color"),
        };
      });

      // bottom
      shape.polygon(() => {
        const top = shape.height - 50;
        const center = shape.width / 2.0;
        return {
          points: [
            [0, top],
            [Math.min(center - 128, 10), top],
            [Math.min(center - 138, 20), top - 10],
            [center - 50, top - 10],
            [center - 40, top],
            [center + 40, top],
            [center + 50, top - 10],
            [Math.max(center + 138, shape.width - 20), top - 10],
            [Math.max(center + 128, shape.width - 10), top],
            [shape.width, top],
            // [shape.width, shape.height],
            // [0, shape.height],
            // [0, top],
            [shape.width, top - 2],
            [Math.max(center + 128, shape.width - 10), top - 2],
            [Math.max(center + 138, shape.width - 20), top - 12],
            [center + 50, top - 12],
            [center + 40, top - 2],
            [center - 40, top - 2],
            [center - 50, top - 12],
            [Math.min(center - 138, 20), top - 12],
            [Math.min(center - 128, 10), top - 2],
            [0, top - 2],
            [0, top],
          ],
          color: getComputedStyle(
            window.document.documentElement,
          ).getPropertyValue("--primary-color"),
        };
      });
    }

    const top = this.element.querySelector("p.top") as HTMLElement
    if (top) {
      const time = function () {
        const theme = window.document.documentElement.getAttribute("theme");
        if (theme === "high-contrast") {
          top.innerText = new Date().toLocaleTimeString().substring(0, 5);
        } else {
          top.innerText = new Date().toLocaleTimeString();
        }
      };
      time();
      setInterval(time, 1000);
    }

    this.element.addEventListener("click", (event) => {
      if (
        event.target &&
        (event.target instanceof SVGElement ||
          event.target instanceof HTMLElement)
      ) {
        if (event.target.closest("button.theme")) {
          this.toggleTheme()
        } else if (event.target.closest("button.files")) {
          event.preventDefault()
          window.location.hash = "files"
          window.document.body.append(<view-files></view-files>)
        } else if (event.target.closest("button.cultivation")) {
          event.preventDefault()
          window.location.hash = "cultivation"
          window.document.body.append(<view-cultivation></view-cultivation>)
        } else if (event.target.closest("button.chat-bot")) {
          if (this.state !== State.CHAT) {
            event.preventDefault()
            this.state = State.CHAT
            window.location.hash = "chat-bot"
            window.document.body.append(<component-chat-bot></component-chat-bot>)
          }
        }
      }
    })
  }
}

window.customElements.define("view-main", Main)
