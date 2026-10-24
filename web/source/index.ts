import "./view/Main";
import "./view/Files";
import "./view/Cultivation";
import "./component/widget/ChatBot";
import "./component/widget/CustomShape";

window.document
  .querySelector("#container")
  ?.append(window.document.createElement("view-main"));

declare global {
  interface Window {
    __vfsRoot?: FileSystemDirectoryHandle;
    initFileSystem?: () => Promise<void>;
  }
}

window.initFileSystem = async (): Promise<void> => {
  if (!("showDirectoryPicker" in window)) {
    console.warn("File System Access API is not supported in this browser.");
    return;
  }

  try {
    const dirHandle = await (window as any).showDirectoryPicker({
      mode: "readwrite",
      id: "user-directory",
      startIn: "documents",
    });
    window.__vfsRoot = dirHandle;
    try {
      await dirHandle.getDirectoryHandle("home", { create: true });
      const homeHandle = await dirHandle.getDirectoryHandle("home", {
        create: false,
      });
      await homeHandle.getDirectoryHandle("user", { create: true });
    } catch (err) {
      console.error("Failed to ensure /home/user directory:", err);
    }
    window.dispatchEvent(new Event("vfs-ready"));
  } catch (err) {
    if ((err as DOMException)?.name !== "AbortError") {
      console.error("Failed to initialize virtual file system:", err);
    }
  }
};
