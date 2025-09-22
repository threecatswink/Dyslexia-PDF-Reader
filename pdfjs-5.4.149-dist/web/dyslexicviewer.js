document.addEventListener("DOMContentLoaded", () => {
  const fontSelector = document.getElementById("dyslexicFontSelector");
  const eventBus = PDFViewerApplication.eventBus;

  // Apply font & opacity when dropdown changes
  fontSelector.addEventListener("change", () => {
    reapplyFontAndOpacity();
  });

  // Apply initially when PDF pages load
  eventBus.on("pagesinit", () => {
    reapplyFontAndOpacity();
  });

  // Reapply on zoom or scale change
  eventBus.on("scalechanging", () => {
    reapplyFontAndOpacity();
  });
});

function reapplyFontAndOpacity() {
  const fontSelector = document.getElementById("dyslexicFontSelector");
  const selectedFont = fontSelector.value; // e.g., "", "dyslexic", "dyslexicBold", etc.

  document.querySelectorAll(".page").forEach(page => {
    const textLayer = page.querySelector(".textLayer");
    const canvas = page.querySelector("canvas");

    // Update textLayer spans
    if (textLayer) {
      textLayer.querySelectorAll("span").forEach(span => {
        span.classList.remove("dyslexic", "dyslexicBold", "dyslexicItalic");
        if (selectedFont) span.classList.add(selectedFont);
      });

      textLayer.style.display = selectedFont ? "block" : "none";
    }

    // Update canvas opacity
    if (canvas) {
      canvas.style.opacity = selectedFont ? 0.15 : 1;
    }
  });
}