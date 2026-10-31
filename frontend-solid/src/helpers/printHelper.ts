export function createElementPrinter() {
  let frame: HTMLIFrameElement | undefined;
  let cancel: (() => void) | undefined;

  function dispose(): void {
    cancel?.();
    cancel = undefined;

    frame?.remove();
    frame = undefined;
  }

  async function print(element: HTMLElement, title: string): Promise<void> {
    dispose();

    const source = element.ownerDocument;
    const iframe = source.createElement("iframe");

    frame = iframe;
    iframe.title = title;
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.cssText = "position: fixed; left: -10000px; top: 0; width: 80mm; height: 100vh; border: 0; ";

    source.body.append(iframe);

    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      const target = iframe.contentDocument;
      const printWindow = iframe.contentWindow;

      if (!target || !printWindow) {
        throw new Error("Print document is unavailable");
      }

      target.open();
      target.write("<!doctype html><html><head></head><body></body></html>");
      target.close();

      target.title = title;
      target.documentElement.lang = source.documentElement.lang;

      const base = target.createElement("base");
      base.href = source.baseURI;
      target.head.append(base);

      const resources: Promise<unknown>[] = [];

      for (const node of source.querySelectorAll('style, link[rel="stylesheet"]')) {
        const copy = node.cloneNode(true) as HTMLStyleElement | HTMLLinkElement;

        if (copy.tagName === "LINK") {
          const stylesheetLoaded = new Promise<void>((resolve, reject) => {
            copy.onload = () => resolve();
            copy.onerror = () => reject(new Error("Print stylesheet failed to load"));
          });

          resources.push(stylesheetLoaded);
        }

        target.head.append(copy);
      }

      const style = target.createElement("style");
      style.textContent = `
        @page { margin: 0; }
        html, body {
          margin: 0 !important; padding: 0 !important;
          height: auto !important; overflow: visible !important;
          background: white !important; color: black !important;
          color-scheme: light; print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        #bill { width: 80mm !important; margin: 0 !important; padding: 0 !important; }
      `;
      target.head.append(style);

      const bill = element.cloneNode(true);
      target.body.append(bill);

      for (const image of target.images) {
        image.loading = "eager";

        const imageDecoded = image.decode();
        resources.push(imageDecoded);
      }

      const cancellation = new Promise<never>((_, reject) => {
        cancel = () => reject(new Error("Printing cancelled"));
        timeout = setTimeout(() => reject(new Error("Print resources timed out")), 15000);
      });

      const waitForResources = async (): Promise<void> => {
        await Promise.all(resources);

        void target.body.offsetHeight;
        await target.fonts.ready;

        const hasFontError = [...target.fonts].some((font) => font.status === "error");

        if (hasFontError) {
          throw new Error("Print font failed to load");
        }
      };

      const resourcesReady = waitForResources();
      await Promise.race([resourcesReady, cancellation]);

      if (frame !== iframe) {
        return;
      }

      const previousTitle = source.title;

      try {
        source.title = title;
        printWindow.focus();
        printWindow.print();
      } finally {
        source.title = previousTitle;
      }
    } catch (error) {
      if (frame === iframe) {
        dispose();
      }

      throw error;
    } finally {
      clearTimeout(timeout);

      if (frame === iframe) {
        cancel = undefined;
      }
    }
  }

  return { print, dispose };
}
