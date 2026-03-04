import { toPng } from 'html-to-image';
import { flushSync } from 'react-dom';
import React from 'react';
import { SlideData } from './slides';

const SLIDE_W = 1280;
const SLIDE_H = 720;
// Render slides at 3× physical size so text/vectors are crisp in the capture
const EXPORT_SCALE = 3;

export async function exportToPdf(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement | null,
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  const { createRoot } = await import('react-dom/client');
  const { default: jsPDF } = await import('jspdf');

  // Container is EXPORT_SCALE × the slide dimensions so the scaled content fits exactly
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: ${SLIDE_W * EXPORT_SCALE}px;
    height: ${SLIDE_H * EXPORT_SCALE}px;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  `;
  document.body.appendChild(container);
  const root = createRoot(container);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [SLIDE_W, SLIDE_H] });

  try {
    for (let i = 0; i < slides.length; i++) {
      onProgress?.(i + 1, slides.length);

      const el = renderSlide(slides[i], false);
      if (el) {
        // Wrap in a scale wrapper so the 1280×720 slide fills the 3× container
        flushSync(() =>
          root.render(
            React.createElement(
              'div',
              { style: { transform: `scale(${EXPORT_SCALE})`, transformOrigin: 'top left', width: SLIDE_W, height: SLIDE_H } },
              el,
            ),
          ),
        );
      }

      // Small delay for images / web fonts to finish loading
      await new Promise<void>((r) => setTimeout(r, 400));

      const dataUrl = await toPng(container, {
        width: SLIDE_W * EXPORT_SCALE,
        height: SLIDE_H * EXPORT_SCALE,
        pixelRatio: 1,
        skipFonts: false,
      });

      if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'landscape');
      pdf.addImage(dataUrl, 'PNG', 0, 0, SLIDE_W, SLIDE_H);
    }

    pdf.save('airops-deck.pdf');
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}
