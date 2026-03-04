import { toPng } from 'html-to-image';
import { SlideData } from './slides';

// PDF page dimensions: 16:9 at 72 dpi — 1280×720 CSS px maps to 1280×720 pdf units
// jsPDF: use 'px' unit so 1 CSS px = 1 PDF user unit
const SLIDE_W = 1280;
const SLIDE_H = 720;

export async function exportToPdf(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement | null,
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  const { createRoot } = await import('react-dom/client');
  const { default: jsPDF } = await import('jspdf');

  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  `;
  document.body.appendChild(container);
  const root = createRoot(container);

  // jsPDF with px units, landscape 16:9
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [SLIDE_W, SLIDE_H] });

  try {
    for (let i = 0; i < slides.length; i++) {
      onProgress?.(i + 1, slides.length);

      await new Promise<void>((resolve) => {
        const el = renderSlide(slides[i], false);
        if (el) root.render(el);
        setTimeout(resolve, 200);
      });

      const dataUrl = await toPng(container, {
        width: SLIDE_W,
        height: SLIDE_H,
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
