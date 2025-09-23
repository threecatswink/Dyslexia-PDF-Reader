/*
Debugged dyslexic overlay script
- Uses a button to toggle OpenDyslexic fonts.
- Ensures text remains visible (no accidental display:none or transform off-page).
- Background forced white when enabled.
*/

import { PDFViewerApplication } from "./viewer.mjs";

let appliedPages = new WeakSet();
let paragraphShiftCache = new WeakMap();
let dyslexicEnabled = false;

document.addEventListener("DOMContentLoaded", () => {
  const eventBus = PDFViewerApplication.eventBus;

  // Button Handling
  const dyslexicToggle = document.getElementById("dyslexicToggle");
  if (dyslexicToggle) {
    dyslexicToggle.addEventListener("click", () => {
      dyslexicEnabled = !dyslexicEnabled;
      applyFontAndOpacity();
    });
  }

  // Update
  eventBus.on("pagechanging", () => applyFontAndOpacity());
  eventBus.on("scalechanging", () => applyFontAndOpacity());
  eventBus.on("textlayerrendered", ({ pageNumber }) => {
    requestAnimationFrame(() => applyFontAndOpacity(pageNumber));
  });

  applyFontAndOpacity();
});

function applyFontAndOpacity(pageNumber = null) {
  const selected = dyslexicEnabled;

  // Set Background to White
  const viewerContainer = document.querySelector("#viewerContainer") || document.body;
  viewerContainer.style.backgroundColor = selected ? "white" : "";

  const pages = pageNumber
    ? [document.querySelector(`.page[data-page-number='${pageNumber}']`)]
    : document.querySelectorAll(".page");

  pages.forEach(page => {
    if (!page) return;
    const textLayer = page.querySelector(".textLayer");
    const canvases = page.querySelectorAll("canvas");

    if (textLayer) {
      // Ensure visibility
      textLayer.style.overflow = "visible";
      textLayer.style.visibility = "visible";

      textLayer.querySelectorAll("span").forEach(span => {
        if (selected) {

          // Grab computed style once
          const computed = window.getComputedStyle(span);
          const weight = parseInt(computed.fontWeight, 10) >= 600 ? "bold" : "normal";
          const style  = computed.fontStyle === "italic" ? "italic" : "normal";

          // Apply family + weight/style
          span.style.fontFamily = "OpenDyslexic, sans-serif";
          span.style.fontWeight = weight;
          span.style.fontStyle  = style;

          // Preserve positioning and color
          span.style.display = "inline-block";
          span.style.color   = "black";
        } else {
          span.style.fontFamily = "";
          span.style.display = "";
          span.style.transform = "";
          span.style.color = "";
        }
      });

      if (selected) {
        page.style.paddingBottom = "20px";
        textLayer.style.position = "absolute";
        textLayer.style.left = "50%";
        textLayer.style.transform = "translateX(-50%)";

        if (!paragraphShiftCache.has(page)) {
          const shifts = fixOverlapsByParagraph(textLayer);
          paragraphShiftCache.set(page, shifts);
        } else {
          applyCachedShifts(textLayer, paragraphShiftCache.get(page));
        }

        appliedPages.add(page);
      } else {
        page.style.paddingBottom = "";
        textLayer.style.position = "";
        textLayer.style.left = "";
        textLayer.style.transform = "";
        appliedPages.delete(page);
        paragraphShiftCache.delete(page);
      }

      textLayer.style.display = "block"; // always visible
    }

    canvases.forEach(c => {
      c.style.opacity = selected ? 0.15 : 1;
    });
  });
}

function fixOverlapsByParagraph(textLayer) {
  const spans = Array.from(textLayer.querySelectorAll("span"));
  if (spans.length === 0) return [];

  const paragraphs = [];
  let currentPara = [];
  let lastTop = null;

  spans.forEach(span => {
    const top = span.offsetTop;
    if (lastTop !== null && Math.abs(top - lastTop) > 20) {
      paragraphs.push(currentPara);
      currentPara = [];
    }
    currentPara.push(span);
    lastTop = top;
  });
  if (currentPara.length > 0) paragraphs.push(currentPara);

  const shifts = [];
  let lastBox = null;

  paragraphs.forEach((paragraph, idx) => {
    const rects = paragraph.map(s => ({
      left: s.offsetLeft,
      top: s.offsetTop,
      right: s.offsetLeft + s.offsetWidth,
      bottom: s.offsetTop + s.offsetHeight
    }));

    const paraBox = {
      left: Math.min(...rects.map(r => r.left)),
      right: Math.max(...rects.map(r => r.right)),
      top: Math.min(...rects.map(r => r.top)),
      bottom: Math.max(...rects.map(r => r.bottom))
    };

    let shift = 0;
    if (lastBox && paraBox.top < lastBox.bottom && paraBox.left < lastBox.right) {
      shift = (lastBox.right - paraBox.left) + 10;
      paragraph.forEach(span => {
        span.style.transform = `translateX(${shift}px)`;
      });
      paraBox.left += shift;
      paraBox.right += shift;
    }

    shifts.push({ idx, shift });
    lastBox = paraBox;
  });

  return shifts;
}

function applyCachedShifts(textLayer, shifts) {
  const spans = Array.from(textLayer.querySelectorAll("span"));
  if (spans.length === 0) return;

  const paragraphs = [];
  let currentPara = [];
  let lastTop = null;

  spans.forEach(span => {
    const top = span.offsetTop;
    if (lastTop !== null && Math.abs(top - lastTop) > 20) {
      paragraphs.push(currentPara);
      currentPara = [];
    }
    currentPara.push(span);
    lastTop = top;
  });
  if (currentPara.length > 0) paragraphs.push(currentPara);

  shifts.forEach(({ idx, shift }) => {
    if (shift > 0 && paragraphs[idx]) {
      paragraphs[idx].forEach(span => {
        span.style.transform = `translateX(${shift}px)`;
      });
    }
  });
}