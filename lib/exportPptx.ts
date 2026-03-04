import { toPng } from 'html-to-image';
import { SlideData } from './slides';

async function getPptxGenJs() {
  const PptxGenJS = (await import('pptxgenjs')).default;
  return PptxGenJS;
}

export async function buildPptxBlob(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement | null,
  onProgress?: (current: number, total: number) => void,
): Promise<Blob> {
  const { createRoot } = await import('react-dom/client');

  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 1280px;
    height: 720px;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  `;
  document.body.appendChild(container);

  const root = createRoot(container);
  const PptxGenJS = await getPptxGenJs();
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';

  try {
    for (let i = 0; i < slides.length; i++) {
      onProgress?.(i + 1, slides.length);

      await new Promise<void>((resolve) => {
        const el = renderSlide(slides[i], false);
        if (el) root.render(el);
        setTimeout(resolve, 200);
      });

      const dataUrl = await toPng(container, {
        width: 1280,
        height: 720,
        pixelRatio: 1,
        skipFonts: false,
      });

      const slide = pptx.addSlide();
      slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' });
    }

    // Return as Blob
    const arrayBuffer = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer;
    return new Blob([arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}

export async function exportToPptx(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement | null,
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  const blob = await buildPptxBlob(slides, renderSlide, onProgress);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'airops-deck.pptx';
  a.click();
  URL.revokeObjectURL(url);
}
