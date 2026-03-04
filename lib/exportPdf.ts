import { toPng } from 'html-to-image';
import { flushSync } from 'react-dom';
import { SlideData } from './slides';

const SLIDE_W = 1280;
const SLIDE_H = 720;

export async function exportToPdf(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement | null,
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  const { createRoot } = await import('react-dom/client');
  const { default: jsPDF } = await import('jspdf');

  // z-index: -1 keeps it rendered but behind all page content (invisible to user)
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
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

      // flushSync forces React to commit synchronously before we capture
      const el = renderSlide(slides[i], false);
      if (el) flushSync(() => root.render(el));

      // Small delay for images / web fonts to finish loading
      await new Promise<void>((r) => setTimeout(r, 300));

      const dataUrl = await toPng(container, {
        width: SLIDE_W,
        height: SLIDE_H,
        pixelRatio: 2,
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
