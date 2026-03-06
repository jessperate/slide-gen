/**
 * Native PPTX generator — produces fully-editable slides (text boxes + shapes)
 * instead of flat screenshot images. Each slide type is faithfully recreated
 * using pptxgenjs primitives.
 *
 * Coordinate system:
 *   Canvas: 1280 × 720 px
 *   PPTX layout: 10" × 5.625" (LAYOUT_WIDE)
 *   Scale: S = 10 / 1280 = 0.0078125  (same for both axes)
 *   x_in = x_px * S,  y_in = y_px * S,  w_in = w_px * S,  h_in = h_px * S
 *   font-pt = Math.round(px * 0.75)
 */

import pptxgen from 'pptxgenjs';
import type { SlideData } from './slides';
import type { SlideTheme as ST } from './themes';

// ─── helpers ────────────────────────────────────────────────────────────────

const S = 10 / 1280; // scale factor px → inches

/** Convert px to inches */
const px = (n: number) => n * S;

/** Strip HTML tags and trim */
const txt = (s: string) => (s ?? '').replace(/<[^>]*>/g, '').trim();

/** Strip leading '#' from hex color */
const hex = (c: string) => c.replace('#', '');

/** px → font points */
const pt = (n: number) => Math.round(n * 0.75);

/** Font face mapping */
function fontFace(family: 'saans' | 'serrif' | 'mono'): string {
  if (family === 'saans') return 'DM Sans';
  if (family === 'serrif') return 'Lora';
  return 'Roboto Mono';
}

type PptxSlide = ReturnType<InstanceType<typeof pptxgen>['addSlide']>;

/** Add a thin accent rect (bottom bar, etc.) */
function addRect(
  slide: PptxSlide,
  xPx: number,
  yPx: number,
  wPx: number,
  hPx: number,
  color: string,
) {
  slide.addShape((pptxgen as unknown as { ShapeType: Record<string, string> }).ShapeType.rect as 'rect', {
    x: px(xPx),
    y: px(yPx),
    w: px(wPx),
    h: px(hPx),
    fill: { color: hex(color) },
    line: { color: hex(color), width: 0 },
  });
}

/** Add a text box */
function addText(
  slide: PptxSlide,
  content: string,
  xPx: number,
  yPx: number,
  wPx: number,
  hPx: number,
  opts: {
    fontSize?: number; // px
    fontFamily?: 'saans' | 'serrif' | 'mono';
    color?: string;
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    wrap?: boolean;
    autoFit?: boolean;
    capitalize?: boolean;
  } = {},
) {
  const stripped = txt(content);
  if (!stripped) return;

  slide.addText(stripped, {
    x: px(xPx),
    y: px(yPx),
    w: px(wPx),
    h: px(hPx),
    fontSize: pt(opts.fontSize ?? 14),
    fontFace: fontFace(opts.fontFamily ?? 'saans'),
    color: hex(opts.color ?? '#000000'),
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    align: opts.align ?? 'left',
    valign: opts.valign ?? 'top',
    wrap: opts.wrap ?? true,
    autoFit: opts.autoFit ?? true,
  });
}

/** Add an image. Only adds data: URIs directly; skips https:// URLs. */
function addImage(
  slide: PptxSlide,
  imageUrl: string | undefined,
  xPx: number,
  yPx: number,
  wPx: number,
  hPx: number,
  placeholderColor?: string,
) {
  if (!imageUrl) {
    // No image — add placeholder rect
    if (placeholderColor) addRect(slide, xPx, yPx, wPx, hPx, placeholderColor);
    return;
  }
  if (imageUrl.startsWith('data:')) {
    slide.addImage({
      data: imageUrl as `data:${string}`,
      x: px(xPx),
      y: px(yPx),
      w: px(wPx),
      h: px(hPx),
      sizing: { type: 'cover', w: px(wPx), h: px(hPx) },
    });
  } else {
    // https:// — Google Slides won't allow cross-origin images in PPTX
    if (placeholderColor) addRect(slide, xPx, yPx, wPx, hPx, placeholderColor);
  }
}

// ─── slide builders ─────────────────────────────────────────────────────────

function buildCoverSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'cover' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Background image (full bleed, semi-transparent)
  if (data.imageUrl) {
    addImage(slide, data.imageUrl, 0, 0, 1280, 720, theme.darkBg);
  }

  // Eyebrow — top center, mono small
  addText(slide, data.eyebrow ?? '', 0, 72, 1280, 40, {
    fontSize: 11,
    fontFamily: 'mono',
    color: theme.textOnDark,
    align: 'center',
    valign: 'middle',
    bold: true,
  });

  // Headline — vertically centered (approx y=280 for 720 canvas)
  addText(slide, data.headline ?? '', 120, 240, 1040, 200, {
    fontSize: 64,
    fontFamily: 'serrif',
    color: theme.textOnDark,
    align: 'center',
    valign: 'middle',
    wrap: true,
  });

  // Subheadline — near bottom
  if (data.subheadline !== undefined) {
    addText(slide, data.subheadline, 120, 590, 1040, 40, {
      fontSize: 14,
      fontFamily: 'saans',
      color: 'rgba(255,255,255,0.5)',
      align: 'center',
      valign: 'middle',
    });
  }
}

function buildSectionSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'section' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Number + label row top-left (mono, small)
  const numberLabel = `${txt(data.number ?? '')}  |  ${txt(data.label ?? '')}`;
  addText(slide, numberLabel, 48, 40, 600, 32, {
    fontSize: 11,
    fontFamily: 'mono',
    color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#999999'),
    bold: true,
  });

  // Left accent bar (3px wide, 48px tall, centered vertically ~360)
  addRect(slide, 48, 336, 3, 48, theme.accentMid);

  // Headline — beside accent bar
  addText(slide, data.headline ?? '', 83, 280, 900, 200, {
    fontSize: 56,
    fontFamily: 'serrif',
    color: theme.textOnDark,
    wrap: true,
    valign: 'middle',
  });
}

function buildContentSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'content' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Headline
  addText(slide, data.headline ?? '', 64, 64, 1152, 70, {
    fontSize: Math.round(44 * s),
    fontFamily: 'serrif',
    color: theme.textOnLight,
    valign: 'middle',
  });

  // Divider line at y=144
  addRect(slide, 64, 144, 1152, 1, theme.stroke);

  // Columns — side by side
  const colCount = data.columns.length;
  const colWidth = Math.floor(1152 / colCount);

  data.columns.forEach((col, i) => {
    const colX = 64 + i * colWidth;
    const innerPadL = i > 0 ? 48 : 0;
    const innerPadR = i < colCount - 1 ? 48 : 0;
    const contentX = colX + innerPadL;
    const contentW = colWidth - innerPadL - innerPadR;

    // Vertical separator
    if (i > 0) addRect(slide, colX, 168, 1, 480, theme.stroke);

    // Accent dot
    addRect(slide, contentX, 168, 8, 8, theme.accentMid);

    // Heading
    addText(slide, col.heading ?? '', contentX, 196, contentW, 50, {
      fontSize: Math.round(18 * s),
      fontFamily: 'saans',
      color: theme.textOnLight,
      bold: true,
      wrap: true,
    });

    // Body
    addText(slide, col.body ?? '', contentX, 256, contentW, 380, {
      fontSize: Math.round(15 * s),
      fontFamily: 'saans',
      color: theme.bodyOnLight,
      wrap: true,
      valign: 'top',
    });
  });
}

function buildThreeColSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'three-col' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Page headline
  addText(slide, data.headline ?? '', 64, 48, 1152, 60, {
    fontSize: Math.round(44 * s),
    fontFamily: 'serrif',
    color: theme.textOnLight,
    valign: 'middle',
  });

  // Full-width rule at y=120
  addRect(slide, 64, 120, 1152, 1, theme.stroke);

  // Three columns below y=144
  const colCount = data.columns.length;
  const colWidth = Math.floor(1152 / colCount);

  data.columns.forEach((col, i) => {
    const colX = 64 + i * colWidth;
    const innerX = colX + (i > 0 ? 32 : 0);
    const innerW = colWidth - (i > 0 ? 32 : 0) - (i < colCount - 1 ? 32 : 0);

    // Vertical separator
    if (i > 0) addRect(slide, colX, 144, 1, 510, theme.stroke);

    // Icon (text)
    addText(slide, col.icon ?? '', innerX, 168, 40, 40, {
      fontSize: 28,
      fontFamily: 'saans',
      color: theme.accentMid,
      align: 'left',
      valign: 'middle',
    });

    // Column header
    addText(slide, col.header ?? '', innerX, 216, innerW, 40, {
      fontSize: Math.round(18 * s),
      fontFamily: 'saans',
      color: theme.textOnLight,
      bold: true,
      wrap: true,
    });

    // Rule below header
    addRect(slide, innerX, 264, innerW, 1, theme.stroke);

    // Body
    addText(slide, col.body ?? '', innerX, 280, innerW, 380, {
      fontSize: Math.round(14 * s),
      fontFamily: 'saans',
      color: theme.mutedOnLight,
      wrap: true,
      valign: 'top',
    });
  });
}

function buildDiagramSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'diagram' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Headline strip top (h=100)
  addRect(slide, 0, 0, 1280, 100, theme.lightBg);
  addText(slide, data.headline ?? '', 64, 0, 1152, 100, {
    fontSize: Math.round(44 * s),
    fontFamily: 'serrif',
    color: theme.textOnLight,
    valign: 'middle',
  });

  // Columns below headline
  const colCount = data.columns.length;
  const colWidth = Math.floor(1280 / colCount);
  const bodyAreaTop = 100;
  const bodyAreaH = 714 - bodyAreaTop; // 614

  data.columns.forEach((col, i) => {
    const colTheme = theme.diagramColBgs[i % theme.diagramColBgs.length];
    const colX = i * colWidth;

    // Column separator
    if (i > 0) addRect(slide, colX, bodyAreaTop, 1, bodyAreaH, theme.stroke);

    // Colored header band (approx 140px tall)
    const headerH = 140;
    addRect(slide, colX, bodyAreaTop, colWidth, headerH, colTheme.bg);

    // Step number
    addText(slide, String(i + 1).padStart(2, '0'), colX + 40, bodyAreaTop + 32, colWidth - 80, 20, {
      fontSize: 11,
      fontFamily: 'mono',
      color: colTheme.text,
      bold: true,
    });

    // Column header text
    addText(slide, col.header ?? '', colX + 40, bodyAreaTop + 56, colWidth - 80, 80, {
      fontSize: Math.round(32 * s),
      fontFamily: 'serrif',
      color: colTheme.text,
      wrap: true,
    });

    // Body content area background
    const bodyBg = i % 2 === 1 ? '#ffffff' : theme.lightBg;
    addRect(slide, colX, bodyAreaTop + headerH, colWidth, bodyAreaH - headerH, bodyBg);

    // Body text
    addText(slide, col.body ?? '', colX + 40, bodyAreaTop + headerH + 32, colWidth - 80, 200, {
      fontSize: Math.round(16 * s),
      fontFamily: 'saans',
      color: theme.bodyOnLight,
      wrap: true,
      valign: 'top',
    });

    // Tag (bottom of body area)
    if (col.tag !== undefined) {
      addText(slide, col.tag, colX + 40, bodyAreaTop + headerH + 250, colWidth - 80, 32, {
        fontSize: 10,
        fontFamily: 'mono',
        color: theme.accentMid,
        bold: true,
        wrap: false,
      });
    }
  });
}

function buildAgendaSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'agenda' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const slide = pptx.addSlide();

  // Left panel (480px wide)
  addRect(slide, 0, 0, 480, 720, theme.agendaLeftBg);

  // Right panel (800px wide)
  slide.background = { color: hex(theme.darkBg) };
  addRect(slide, 480, 0, 800, 720, theme.darkBg);

  // Title on right
  addText(slide, data.title ?? '', 528, 72, 720, 80, {
    fontSize: Math.round(56 * s),
    fontFamily: 'serrif',
    color: theme.textOnDark,
    valign: 'middle',
  });

  // Items on right, starting at y=200
  const itemSpacing = Math.round(40 * s);
  data.items.forEach((item, i) => {
    const itemY = 200 + i * (24 + itemSpacing);

    // Number
    addText(slide, String(i + 1).padStart(2, '0'), 528, itemY, 40, 30, {
      fontSize: 18,
      fontFamily: 'serrif',
      color: theme.accentMid,
      bold: true,
      valign: 'top',
    });

    // Item text
    addText(slide, item ?? '', 576, itemY, 680, 30, {
      fontSize: Math.round(18 * s),
      fontFamily: 'saans',
      color: theme.lightBg,
      valign: 'top',
      wrap: true,
    });
  });
}

function buildQuoteSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'quote' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Background image (low opacity placeholder)
  if (data.imageUrl) {
    addImage(slide, data.imageUrl, 0, 0, 1280, 720, theme.lightBg);
  }

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Quote text — vertically centered (~y=200)
  addText(slide, data.quote ?? '', 120, 180, 1040, 280, {
    fontSize: 40,
    fontFamily: 'serrif',
    color: theme.textOnLight,
    align: 'center',
    wrap: true,
    valign: 'middle',
  });

  // Attribution rule
  addRect(slide, 608, 490, 64, 2, theme.accentMid);

  // Attribution
  addText(slide, data.attribution ?? '', 120, 500, 1040, 40, {
    fontSize: 14,
    fontFamily: 'saans',
    color: theme.textOnLight,
    bold: true,
    align: 'center',
    valign: 'middle',
  });
}

function buildBigQuoteSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'big-quote' }>, theme: ST) {
  const hasImage = !!data.imageUrl;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Right image panel
  if (hasImage) {
    addImage(slide, data.imageUrl, 680, 0, 600, 720, theme.darkBg);
  }

  const textW = hasImage ? 600 : 1120;
  const quoteSize = hasImage ? 36 : 48;

  // Quote text
  addText(slide, data.quote ?? '', 80, 160, textW, 280, {
    fontSize: quoteSize,
    fontFamily: 'serrif',
    color: theme.textOnDark,
    wrap: true,
    valign: 'top',
  });

  // Rule
  addRect(slide, 80, 460, 40, 2, theme.accent);

  // Attribution
  addText(slide, data.attribution ?? '', 80, 470, textW, 30, {
    fontSize: 15,
    fontFamily: 'saans',
    color: theme.textOnDark,
    bold: true,
    valign: 'top',
  });

  // Role
  if (data.role !== undefined) {
    addText(slide, data.role, 80, 508, textW, 30, {
      fontSize: 13,
      fontFamily: 'saans',
      color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#999999'),
      valign: 'top',
    });
  }
}

function buildStatsSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'stats' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Left column — headline + thesis
  addText(slide, data.headline ?? '', 64, 200, 480, 120, {
    fontSize: 44,
    fontFamily: 'serrif',
    color: theme.textOnLight,
    wrap: true,
    valign: 'top',
  });

  // Thesis left border accent
  addRect(slide, 64, 336, 3, 80, theme.accentMid);
  addText(slide, data.thesis ?? '', 87, 336, 440, 120, {
    fontSize: 15,
    fontFamily: 'saans',
    color: theme.bodyOnLight,
    wrap: true,
    valign: 'top',
  });

  // Vertical separator
  addRect(slide, 592, 64, 1, 590, theme.stroke);

  // Right column — metric cards
  const METRIC_BG: Record<string, string> = { olive: '#F5F5E8', teal: '#E8EEF5', magenta: '#F8E8F0' };

  data.metrics.forEach((metric, i) => {
    const cardY = 80 + i * 160;
    const cardBg = theme.id === 'green' ? (METRIC_BG[metric.color] ?? '#F5F5E8') : '#ffffff';
    addRect(slide, 624, cardY, 592, 136, cardBg);

    // Value
    addText(slide, metric.value ?? '', 648, cardY + 16, 200, 100, {
      fontSize: 56,
      fontFamily: 'serrif',
      color: theme.textOnLight,
      valign: 'middle',
    });

    // Label
    addText(slide, metric.label ?? '', 860, cardY + 40, 340, 60, {
      fontSize: 14,
      fontFamily: 'saans',
      color: theme.mutedOnLight,
      wrap: true,
      valign: 'middle',
    });
  });
}

function buildHeroSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'hero' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Headline — large, centered, accent color
  addText(slide, data.headline ?? '', 80, 180, 1120, 300, {
    fontSize: 96,
    fontFamily: 'serrif',
    color: theme.accent,
    align: 'center',
    wrap: true,
    valign: 'middle',
  });

  // "Trusted by" label
  addText(slide, 'Trusted by', 0, 544, 1280, 24, {
    fontSize: 10,
    fontFamily: 'mono',
    color: '#4d4d4d',
    align: 'center',
    bold: true,
    valign: 'middle',
  });

  // Customer logo domains as text (since images are external URLs)
  if (data.customerLogos.length > 0) {
    const logoText = data.customerLogos.map((d) => txt(d)).join('   ·   ');
    addText(slide, logoText, 80, 580, 1120, 30, {
      fontSize: 11,
      fontFamily: 'mono',
      color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#666666'),
      align: 'center',
      valign: 'middle',
    });
  }
}

function buildFeatureListSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'feature-list' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Headline
  addText(slide, data.headline ?? '', 64, 48, 1152, 70, {
    fontSize: Math.round(44 * s),
    fontFamily: 'serrif',
    color: theme.textOnLight,
    valign: 'middle',
  });

  // Items
  const items = data.items.slice(0, 5);
  const itemH = Math.round(96 * s);

  items.forEach((item, i) => {
    const itemY = 144 + i * itemH;

    // Bottom border line
    addRect(slide, 64, itemY + itemH - 1, 1152, 1, theme.stroke);

    // Icon
    addText(slide, item.icon ?? '', 64, itemY, 40, itemH, {
      fontSize: 24,
      fontFamily: 'saans',
      color: theme.accentMid,
      valign: 'middle',
    });

    // Title
    addText(slide, item.title ?? '', 120, itemY, Math.round(220 * s), itemH, {
      fontSize: Math.round(16 * s),
      fontFamily: 'saans',
      color: theme.textOnLight,
      bold: true,
      wrap: true,
      valign: 'middle',
    });

    // Body
    addText(slide, item.body ?? '', 120 + Math.round(220 * s) + 24, itemY, 860, itemH, {
      fontSize: Math.round(14 * s),
      fontFamily: 'saans',
      color: theme.mutedOnLight,
      wrap: true,
      valign: 'middle',
    });
  });
}

function buildChecklistSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'checklist' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Headline
  addText(slide, data.headline ?? '', 64, 48, 1152, 70, {
    fontSize: Math.round(44 * s),
    fontFamily: 'serrif',
    color: theme.textOnLight,
    valign: 'middle',
  });

  // Items
  const itemH = Math.round(88 * s);

  data.items.forEach((item, i) => {
    const itemY = 144 + i * itemH;

    // Bottom border
    addRect(slide, 64, itemY + itemH - 1, 1152, 1, theme.stroke);

    // Checkbox indicator (filled = accentMid, empty = outlined)
    const checkboxColor = item.checked ? theme.accentMid : theme.stroke;
    addRect(slide, 64, itemY + Math.round((itemH - 24) / 2), 24, 24, checkboxColor);
    if (item.checked) {
      addText(slide, '✓', 64, itemY + Math.round((itemH - 24) / 2), 24, 24, {
        fontSize: 12,
        fontFamily: 'saans',
        color: '#ffffff',
        align: 'center',
        valign: 'middle',
        bold: true,
      });
    }

    // Title
    addText(slide, item.title ?? '', 104, itemY, Math.round(240 * s), itemH, {
      fontSize: Math.round(16 * s),
      fontFamily: 'saans',
      color: theme.textOnLight,
      bold: true,
      wrap: true,
      valign: 'middle',
    });

    // Body
    addText(slide, item.body ?? '', 104 + Math.round(240 * s) + 24, itemY, 900, itemH, {
      fontSize: Math.round(14 * s),
      fontFamily: 'saans',
      color: theme.mutedOnLight,
      wrap: true,
      valign: 'middle',
    });
  });
}

function buildTwoColMediaSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'two-col-media' }>, theme: ST) {
  const s = data.textScale ?? 1;
  const hasImage = !!data.imageUrl;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Right panel (dark or image, 720px wide starting at x=560)
  if (hasImage) {
    addImage(slide, data.imageUrl, 560, 0, 720, 720, theme.darkBg);
  } else {
    addRect(slide, 560, 0, 720, 720, theme.darkBg);
  }

  // Left text column (560px wide)
  let textY = 200;

  // Eyebrow
  if (data.eyebrow !== undefined) {
    addText(slide, data.eyebrow, 72, textY, 440, 30, {
      fontSize: 11,
      fontFamily: 'mono',
      color: theme.accentMid,
      bold: true,
      valign: 'middle',
    });
    textY += 40;
  }

  // Headline
  addText(slide, data.headline ?? '', 72, textY, 440, 200, {
    fontSize: Math.round(48 * s),
    fontFamily: 'serrif',
    color: theme.textOnLight,
    wrap: true,
    valign: 'top',
  });
  textY += Math.round(48 * s) * 3 + 28; // approx height

  // Divider
  addRect(slide, 72, textY, 40, 2, theme.accent);
  textY += 20;

  // Body
  addText(slide, data.body ?? '', 72, textY, 440, 200, {
    fontSize: Math.round(17 * s),
    fontFamily: 'saans',
    color: theme.bodyOnLight,
    wrap: true,
    valign: 'top',
  });
}

function buildCustomerStorySlide(pptx: pptxgen, data: Extract<SlideData, { type: 'customer-story' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Customer label (mono, small, top-left)
  addText(slide, data.customerName ?? '', 64, 48, 400, 30, {
    fontSize: 11,
    fontFamily: 'mono',
    color: theme.accentMid,
    bold: true,
    valign: 'middle',
  });

  // Left column content
  addText(slide, data.headline ?? '', 64, 130, 528, 130, {
    fontSize: 36,
    fontFamily: 'serrif',
    color: theme.textOnLight,
    wrap: true,
    valign: 'top',
  });

  addText(slide, data.body ?? '', 64, 276, 528, 120, {
    fontSize: 14,
    fontFamily: 'saans',
    color: theme.bodyOnLight,
    wrap: true,
    valign: 'top',
  });

  // Attribution
  addText(slide, data.attribution ?? '', 104, 420, 400, 30, {
    fontSize: 13,
    fontFamily: 'saans',
    color: theme.textOnLight,
    bold: true,
    valign: 'middle',
  });

  // Vertical separator
  addRect(slide, 640, 64, 1, 590, theme.stroke);

  // Right column — metric cards
  data.metrics.forEach((metric, i) => {
    const cardY = 96 + i * 170;
    addRect(slide, 672, cardY, 544, 148, '#ffffff');
    // Left accent
    addRect(slide, 672, cardY, 3, 148, theme.accentMid);

    // Value
    addText(slide, metric.value ?? '', 700, cardY + 16, 160, 110, {
      fontSize: 48,
      fontFamily: 'serrif',
      color: theme.textOnLight,
      valign: 'middle',
    });

    // Label
    addText(slide, metric.label ?? '', 876, cardY + 40, 320, 70, {
      fontSize: 13,
      fontFamily: 'saans',
      color: theme.mutedOnLight,
      wrap: true,
      valign: 'middle',
    });
  });
}

function buildContactSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'contact' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // Headline centered
  addText(slide, data.headline ?? '', 120, 220, 1040, 100, {
    fontSize: 52,
    fontFamily: 'serrif',
    color: theme.textOnDark,
    align: 'center',
    wrap: true,
    valign: 'middle',
  });

  // Cards — side by side, centered
  const cardW = 340;
  const cardH = 240;
  const totalW = data.cards.length * cardW + (data.cards.length - 1) * 24;
  const startX = Math.round((1280 - totalW) / 2);
  const cardY = 350;

  data.cards.forEach((card, i) => {
    const cardX = startX + i * (cardW + 24);

    // Card background
    addRect(slide, cardX, cardY, cardW, cardH, theme.darkBg);

    // Card border (simulate with lines)
    addRect(slide, cardX, cardY, cardW, 1, theme.stroke);
    addRect(slide, cardX, cardY + cardH - 1, cardW, 1, theme.stroke);
    addRect(slide, cardX, cardY, 1, cardH, theme.stroke);
    addRect(slide, cardX + cardW - 1, cardY, 1, cardH, theme.stroke);

    let cy = cardY + 40;

    // Name
    addText(slide, card.name ?? '', cardX + 24, cy, cardW - 48, 36, {
      fontSize: 28,
      fontFamily: 'serrif',
      color: theme.textOnDark,
      valign: 'top',
    });
    cy += 42;

    // Role
    addText(slide, card.role ?? '', cardX + 24, cy, cardW - 48, 24, {
      fontSize: 13,
      fontFamily: 'saans',
      color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#999999'),
      valign: 'top',
    });
    cy += 36;

    // Divider
    addRect(slide, cardX + 24, cy, cardW - 48, 1, theme.stroke);
    cy += 14;

    // Contact info
    const rows: string[] = [];
    if (card.linkedin) rows.push(`in: ${txt(card.linkedin)}`);
    if (card.email) rows.push(`@ ${txt(card.email)}`);
    if (card.website) rows.push(`↗ ${txt(card.website)}`);

    if (rows.length > 0) {
      addText(slide, rows.join('\n'), cardX + 24, cy, cardW - 48, 80, {
        fontSize: 12,
        fontFamily: 'saans',
        color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#aaaaaa'),
        wrap: true,
        valign: 'top',
      });
    }
  });
}

function buildTeamSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'team' }>, theme: ST) {
  const count = data.members.length;
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.lightBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  let contentStartY = 100;

  // Headline
  if (data.headline !== undefined) {
    addText(slide, data.headline, 120, 60, 1040, 60, {
      fontSize: 40,
      fontFamily: 'serrif',
      color: theme.textOnLight,
      align: 'center',
      valign: 'middle',
    });
    contentStartY = 156;
  }

  // Team grid
  const avatarSize = count <= 4 ? 140 : 110;
  const gap = count <= 4 ? 48 : 32;
  const itemW = avatarSize + 40; // some padding for text
  const totalW = count * itemW + (count - 1) * gap;
  const startX = Math.round((1280 - totalW) / 2);

  data.members.forEach((member, i) => {
    const memberX = startX + i * (itemW + gap);
    const memberY = contentStartY;

    // Avatar circle placeholder (darkBg circle)
    addRect(slide, memberX, memberY, avatarSize, avatarSize, theme.darkBg);

    // Avatar image
    if (member.imageUrl) {
      addImage(slide, member.imageUrl, memberX, memberY, avatarSize, avatarSize, theme.darkBg);
    } else {
      // Initial letter
      addText(slide, (member.name ?? 'A').charAt(0).toUpperCase(), memberX, memberY, avatarSize, avatarSize, {
        fontSize: Math.round(avatarSize * 0.38 * 0.75), // px * pt
        fontFamily: 'serrif',
        color: theme.accent,
        align: 'center',
        valign: 'middle',
      });
    }

    // Name
    addText(slide, member.name ?? '', memberX - 20, memberY + avatarSize + 16, itemW + 40, 28, {
      fontSize: 16,
      fontFamily: 'saans',
      color: theme.textOnLight,
      bold: true,
      align: 'center',
      wrap: true,
    });

    // Role
    addText(slide, member.role ?? '', memberX - 20, memberY + avatarSize + 48, itemW + 40, 24, {
      fontSize: 10,
      fontFamily: 'mono',
      color: theme.mutedOnLight,
      align: 'center',
      bold: true,
      wrap: true,
    });
  });
}

function buildBackCoverSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'back-cover' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Accent bottom bar
  addRect(slide, 0, 714, 1280, 6, theme.accent);

  // CTA — centered
  addText(slide, data.cta ?? '', 320, 300, 640, 80, {
    fontSize: 18,
    fontFamily: 'saans',
    color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#aaaaaa'),
    align: 'center',
    wrap: true,
    valign: 'middle',
  });

  // URL — bottom center
  addText(slide, data.url ?? '', 0, 620, 1280, 40, {
    fontSize: 12,
    fontFamily: 'mono',
    color: theme.mutedOnDark.replace('rgba(255,255,255,0.4)', '#666666'),
    align: 'center',
    valign: 'middle',
    bold: true,
  });
}

function buildFullImageSlide(pptx: pptxgen, data: Extract<SlideData, { type: 'full-image' }>, theme: ST) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(theme.darkBg) };

  // Full-bleed image
  addImage(slide, data.imageUrl, 0, 0, 1280, 720, theme.darkBg);

  // Caption at bottom
  if (data.caption !== undefined) {
    addText(slide, data.caption, 48, 620, 1184, 60, {
      fontSize: 14,
      fontFamily: 'saans',
      color: '#cccccc',
      wrap: true,
      valign: 'middle',
    });
  }
}

// ─── main export ────────────────────────────────────────────────────────────

export async function buildNativePptxBlob(
  slides: SlideData[],
  getTheme: (slide: SlideData) => ST,
  onProgress?: (current: number, total: number) => void,
): Promise<Blob> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE'; // 10" × 5.625"
  pptx.title = 'AirOps Deck';

  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const data = slides[i];
    const theme = getTheme(data);

    switch (data.type) {
      case 'cover':          buildCoverSlide(pptx, data, theme);          break;
      case 'section':        buildSectionSlide(pptx, data, theme);        break;
      case 'content':        buildContentSlide(pptx, data, theme);        break;
      case 'three-col':      buildThreeColSlide(pptx, data, theme);       break;
      case 'diagram':        buildDiagramSlide(pptx, data, theme);        break;
      case 'agenda':         buildAgendaSlide(pptx, data, theme);         break;
      case 'quote':          buildQuoteSlide(pptx, data, theme);          break;
      case 'big-quote':      buildBigQuoteSlide(pptx, data, theme);       break;
      case 'stats':          buildStatsSlide(pptx, data, theme);          break;
      case 'hero':           buildHeroSlide(pptx, data, theme);           break;
      case 'feature-list':   buildFeatureListSlide(pptx, data, theme);    break;
      case 'checklist':      buildChecklistSlide(pptx, data, theme);      break;
      case 'two-col-media':  buildTwoColMediaSlide(pptx, data, theme);    break;
      case 'customer-story': buildCustomerStorySlide(pptx, data, theme);  break;
      case 'contact':        buildContactSlide(pptx, data, theme);        break;
      case 'team':           buildTeamSlide(pptx, data, theme);           break;
      case 'back-cover':     buildBackCoverSlide(pptx, data, theme);      break;
      case 'full-image':     buildFullImageSlide(pptx, data, theme);      break;
      default:
        // Fallback: blank slide with dark background
        (pptx.addSlide()).background = { color: hex(theme.darkBg) };
    }

    onProgress?.(i + 1, total);
    // Yield to event loop every few slides
    if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
  }

  return (await pptx.write({ outputType: 'blob' })) as Blob;
}
