import Stylesheet from "./Cultivation.css";
import Window from "../support/window/Window";
import Feature from "../feature/cultivation/Cultivation"

export default class Cultivation extends Window {
  private feature: null|Feature
  private static stylesheet: null | CSSStyleSheet = null;

  public constructor() {
    super({
      stylesheet: () => {
        if (!Cultivation.stylesheet) {
          Cultivation.stylesheet = new Stylesheet();
        }
        return [Cultivation.stylesheet];
      },
    });
    this.feature = null
  }

  protected render(): void {
    const canvas = <canvas></canvas> as HTMLCanvasElement
    this.element.append(canvas);
    this.feature = new Feature(canvas)
    this.feature.handler()
  }
}

window.customElements.define("view-cultivation", Cultivation);
