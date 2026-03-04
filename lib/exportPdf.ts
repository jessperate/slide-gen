import { toPng } from 'html-to-image';
import { flushSync } from 'react-dom';
import { SlideData } from './slides';

const SLIDE_W = 1280;
const SLIDE_H = 720;

const FONT_FILES = [
  { family: 'Saans', weight: '400', url: '/fonts/Saans-Regular.ttf' },
  { family: 'Saans', weight: '500', url: '/fonts/Saans-Medium.ttf' },
  { family: 'Saans', weight: '700', url: '/fonts/Saans-Bold.ttf' },
  { family: 'Saans Mono', weight: '500', url: '/fonts/SaansMono-Medium.ttf' },
  { family: 'Serrif VF', weight: '100 900', url: '/fonts/SerrifVF.ttf' },
];

function bufferToBase64(buf: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

async function buildFontEmbedCSS(): Promise<string> {
  const rules = await Promise.all(
    FONT_FILES.map(async ({ family, weight, url }) => {
      const buf = await fetch(url).then((r) => r.arrayBuffer());
      const b64 = bufferToBase64(buf);
      return `@font-face { font-family: "${family}"; src: url("data:font/truetype;base64,${b64}") format("truetype"); font-weight: ${weight}; font-style: normal; }`;
    }),
  );
  return rules.join('\n');
}

export async function exportToPdf(
  slides: SlideData[],
  renderSlide: (data: SlideData, interactive: boolean) => React.ReactElement | null,
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  const { createRoot } = await import('react-dom/client');
  const { default: jsPDF } = await import('jspdf');

  // Pre-fetch and base64-encode fonts so html-to-image gets the real brand fonts
  // instead of falling back to system fonts during SVG serialization.
  const fontEmbedCSS = await buildFontEmbedCSS();

  // Ensure browser has finished loading fonts before we render anything
  await document.fonts.ready;

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

      const el = renderSlide(slides[i], false);
      if (el) flushSync(() => root.render(el));

      // Allow images and any deferred resources to finish loading
      await new Promise<void>((r) => setTimeout(r, 500));

      const dataUrl = await toPng(container, {
        width: SLIDE_W,
        height: SLIDE_H,
        pixelRatio: 3,
        skipFonts: false,
        fontEmbedCSS,
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
