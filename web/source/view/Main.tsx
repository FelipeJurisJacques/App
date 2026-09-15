import Stylesheet from "./Main.css";
import View from "../support/view/View";
import Agent from "../feature/agent/Agent";
import Folder from "../component/icon/Folder.svg";
import Tractor from "../component/icon/Tractor.svg";
import Parallax from "../feature/parallax/Parallax";
import ThemeDark from "../component/icon/ThemeDark.svg";
import ThemeLight from "../component/icon/ThemeLight.svg";
import CustomShape from "../component/widget/CustomShape";
import ThemeHighContrast from "../component/icon/ThemeHighContrast.svg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Main extends View {
  private theme: string;
  private allowCameraRotation = true;

  public constructor() {
    super({
      opened: true,
      stylesheet: () => [new Stylesheet()],
    });
    this.theme = window.localStorage.getItem("theme") || "dark";
    this.applyTheme();
  }

  private applyTheme(): void {
    switch (this.theme) {
      case "light":
        window.document.documentElement.style.colorScheme = "light";
        break;
      case "high-contrast":
        window.document.documentElement.style.colorScheme = "light";
        break;
      case "dark":
      default:
        window.document.documentElement.style.colorScheme = "dark";
        break;
    }
    window.document.documentElement.setAttribute("theme", this.theme);
  }

  private toggleTheme(): void {
    const button = this.element.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;
    button.innerHTML = "";
    switch (this.theme) {
      case "light":
        this.theme = "high-contrast";
        button.innerHTML = `${new ThemeHighContrast()}`;
        break;
      case "high-contrast":
        this.theme = "dark";
        button.innerHTML = `${new ThemeDark()}`;
        break;
      case "dark":
        this.theme = "light";
        button.innerHTML = `${new ThemeLight()}`;
        break;
    }
    window.localStorage.setItem("theme", this.theme);
    this.applyTheme();
  }

  protected render(): void {
    this.element.append(<canvas id="agent-canvas"></canvas>);
    this.element.append(
      <custom-shape>
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
      </custom-shape>,
    );
    switch (window.location.hash) {
      case "#files":
        window.document.body.append(<view-files></view-files>);
        break;
      case "#cultivation":
        window.document.body.append(<view-cultivation></view-cultivation>);
        break;
      default:
        break;
    }
  }

  protected handler(): void {
    const canvas = this.element.querySelector(
      "#agent-canvas",
    ) as HTMLCanvasElement;
    if (canvas) {
      const parallax = new Parallax(canvas);
      let controls: OrbitControls | undefined;
      if (this.allowCameraRotation) {
        parallax.scenes.push((renderer, camera) => {
          if (!controls) {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
          }
          controls.update();
        });
      }

      const agent = new Agent();
      parallax.scenes.push((renderer, camera) => {
        agent.animate();
        renderer.render(agent.getScenes(this.theme), camera);
      });
      parallax.handler();

      // agent.speak('Olá, como posso ajudar você hoje?')
    }

    const shape = this.element.querySelector("custom-shape") as CustomShape;
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

    const top = this.element.querySelector("p.top") as HTMLElement;
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
          this.toggleTheme();
        } else if (event.target.closest("button.files")) {
          event.preventDefault();
          window.location.hash = "files";
          window.document.body.append(<view-files></view-files>);
        } else if (event.target.closest("button.cultivation")) {
          event.preventDefault();
          window.location.hash = "cultivation";
          window.document.body.append(<view-cultivation></view-cultivation>);
        }
      }
    });
  }
}

window.customElements.define("view-main", Main);
