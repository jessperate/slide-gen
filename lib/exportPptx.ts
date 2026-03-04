import { toPng } from 'html-to-image';
import { SlideData } from './slides';

// Dynamic import to avoid SSR issues
async function getPptxGenJs() {
  const PptxGenJS = (await import('pptxgenjs')).default;
  return PptxGenJS;
}

export async function exportToPptx(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement,
  onProgress?: (current: number, total: number) => void,
) {
  const { createRoot } = await import('react-dom/client');

  // Hidden container rendered off-screen at full slide size
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
  pptx.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" — matches 16:9

  try {
    for (let i = 0; i < slides.length; i++) {
      onProgress?.(i + 1, slides.length);

      // Render slide into hidden container
      await new Promise<void>((resolve) => {
        root.render(renderSlide(slides[i], false) as React.ReactElement);
        // Give React + fonts time to paint
        setTimeout(resolve, 180);
      });

      // Capture as PNG
      const dataUrl = await toPng(container, {
        width: 1280,
        height: 720,
        pixelRatio: 1,
        skipFonts: false,
      });

      // Add slide to PPTX
      const slide = pptx.addSlide();
      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      });
    }

    await pptx.writeFile({ fileName: 'airops-deck.pptx' });
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}
