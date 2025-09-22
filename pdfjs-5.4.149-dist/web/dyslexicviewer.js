import { PDFViewerApplication } from "./viewer.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const fontSelector = document.getElementById("dyslexicFontSelector");
  const eventBus = PDFViewerApplication.eventBus;

  fontSelector.addEventListener("change", () => {
    reapplyFontAndOpacity();
  });

  eventBus.on("pagechanging", () => {
    reapplyFontAndOpacity();
  });

  eventBus.on("scalechanging", () => {
    reapplyFontAndOpacity();
  });

  eventBus.on("textlayerrendered", () => {
    reapplyFontAndOpacity();
  });

  reapplyFontAndOpacity();
});

function reapplyFontAndOpacity() {
  const fontSelector = document.getElementById("dyslexicFontSelector");
  const selectedFont = fontSelector.value;

  document.querySelectorAll(".page").forEach(page => {
    const textLayer = page.querySelector(".textLayer");
    const canvases = page.querySelectorAll("canvas");

    if (textLayer) {
      textLayer.querySelectorAll("span").forEach(span => {
        span.classList.remove("dyslexic", "dyslexicBold", "dyslexicItalic", "dyslexicTransform");
        if (selectedFont) {
          span.classList.add(selectedFont);
          textLayer.classList.add("dyslexicTransform");
        }
      });

      textLayer.style.display = selectedFont ? "block" : "none";
    }

    canvases.forEach(c => {
      c.style.opacity = selectedFont ? 0.15 : 1;
    });
  });
}