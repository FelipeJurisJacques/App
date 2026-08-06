import Stylesheet from "./Cultivation.css";
import Window from "../support/window/Window";

export default class Cultivation extends Window {
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
  }

  protected render(): void {
    this.element.append(<h1>Files_Explorer</h1>);
    this.element.append(
      <div class="content">
        <p>Repository data access initialized... [No files found]</p>
      </div>,
    );
  }

  protected handler(): void {}
}

window.customElements.define("view-cultivation", Cultivation);
