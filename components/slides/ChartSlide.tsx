'use client';

import { ChartSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: ChartSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ChartSlideData>) => void;
  theme?: SlideTheme;
}

// ── Color palettes matching Chartwiz exactly ──────────────────────────────────
const CW_COLORS: Record<string, Record<string, string>> = {
  light: {
    bg: '#F8FFFB', border: '#d4e8da', title: '#000d05', subtitle: '#676c79',
    barFill: '#CCFFE0', barStroke: '#002910', barAccent: '#EEFF8C',
    lineStroke: '#008c44', axisTick: '#a5aab6', gridLine: '#f0f0f0',
    pillBg: '#EEFF8C', pillText: '#000d05', logoFill: '#001408', valueText: '#000d05',
  },
  dark: {
    bg: '#002910', border: '#005c2e', title: '#ffffff', subtitle: 'rgba(255,255,255,0.55)',
    barFill: '#005c2e', barStroke: '#008c44', barAccent: '#EEFF8C',
    lineStroke: '#00e676', axisTick: 'rgba(255,255,255,0.35)', gridLine: 'rgba(255,255,255,0.07)',
    pillBg: '#EEFF8C', pillText: '#000d05', logoFill: '#f8fffa', valueText: '#ffffff',
  },
  lime: {
    bg: '#EEFF8C', border: '#c8d866', title: '#000d05', subtitle: '#676c79',
    barFill: '#CCFFE0', barStroke: '#002910', barAccent: '#002910',
    lineStroke: '#008c44', axisTick: '#a5aab6', gridLine: 'rgba(0,0,0,0.08)',
    pillBg: '#002910', pillText: '#EEFF8C', logoFill: '#001408', valueText: '#000d05',
  },
  midnight: {
    bg: '#000d05', border: '#002910', title: '#ffffff', subtitle: 'rgba(255,255,255,0.45)',
    barFill: '#002910', barStroke: '#005c2e', barAccent: '#EEFF8C',
    lineStroke: '#00ff64', axisTick: 'rgba(255,255,255,0.25)', gridLine: 'rgba(255,255,255,0.05)',
    pillBg: '#EEFF8C', pillText: '#000d05', logoFill: '#f8fffa', valueText: '#ffffff',
  },
};

const PAINTING_COLORS = {
  bg: 'transparent', border: 'rgba(255,255,255,0.3)', title: '#ffffff',
  subtitle: 'rgba(255,255,255,0.7)', barFill: 'rgba(255,255,255,0.85)',
  barStroke: 'rgba(0,0,0,0.6)', barAccent: '#EEFF8C',
  lineStroke: '#00ff64', axisTick: 'rgba(255,255,255,0.5)', gridLine: 'rgba(255,255,255,0.15)',
  pillBg: '#EEFF8C', pillText: '#000d05', logoFill: '#f8fffa', valueText: '#000d05',
};

// ── Data parser (matches Chartwiz's parseData) ────────────────────────────────
function parseData(raw: string, type: string): { labels: string[]; values: number[]; headers?: string[]; rows?: string[][]; value?: string; label?: string; sub?: string } {
  if (!raw?.trim()) {
    if (type === 'stat') return { labels: [], values: [], value: '—', label: '', sub: '' };
    return { labels: ['A', 'B', 'C', 'D'], values: [75, 55, 40, 25] };
  }
  if (type === 'table') {
    const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
    return { labels: [], values: [], headers, rows };
  }
  if (type === 'stat') {
    const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const get = (prefix: string) => {
      const line = lines.find(l => l.toLowerCase().startsWith(prefix.toLowerCase() + ':'));
      return line ? line.slice(line.indexOf(':') + 1).trim() : '';
    };
    return { labels: [], values: [], value: get('value') || lines[0] || '—', label: get('label') || lines[1] || '', sub: get('sub') || lines[2] || '' };
  }
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const labels: string[] = [], values: number[] = [];
  for (const line of lines) {
    const sep = line.lastIndexOf(':');
    if (sep < 0) continue;
    const label = line.slice(0, sep).trim();
    const val = parseFloat(line.slice(sep + 1).trim().replace(/[%,]/g, ''));
    if (!isNaN(val)) { labels.push(label); values.push(val); }
  }
  if ((type === 'bar' || type === 'ranked') && labels.length) {
    const sorted = labels.map((l, i) => ({ l, v: values[i] })).sort((a, b) => b.v - a.v);
    return { labels: sorted.map(s => s.l), values: sorted.map(s => s.v) };
  }
  return labels.length ? { labels, values } : { labels: ['A', 'B', 'C', 'D'], values: [75, 55, 40, 25] };
}

function niceMax(max: number) {
  if (max <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
}

function fmt(v: number) {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  if (v % 1 !== 0) return v.toFixed(1);
  return String(Math.round(v));
}

// ── Chart renderers ───────────────────────────────────────────────────────────
function renderBar(labels: string[], values: number[], C: Record<string, string>, W: number, H: number, hiIdx: number, ptOffset: number) {
  const pt = ptOffset + 24, pb = 44, pl = 48, pr = 32;
  const pw = W - pl - pr, ph = H - pt - pb;
  const max = niceMax(Math.max(...values, 1));
  const n = labels.length;
  const barW = Math.min(80, (pw / n) * 0.6);
  const gap = pw / n;
  const autoHi = values.indexOf(Math.max(...values));
  const hiI = hiIdx === -1 ? autoHi : hiIdx;
  return (
    <g>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = pt + ph * f;
        return <line key={i} x1={pl} x2={pl + pw} y1={y} y2={y} stroke={C.gridLine} strokeWidth={1} />;
      })}
      {labels.map((lbl, i) => {
        const bh = Math.max(2, (values[i] / max) * ph);
        const x = pl + gap * i + gap / 2 - barW / 2;
        const y = pt + ph - bh;
        const fill = i === hiI ? C.barAccent : C.barFill;
        const stroke = i === hiI ? '#8a9600' : C.barStroke;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} fill={fill} stroke={stroke} strokeWidth={0.8} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight="600" fill={C.valueText} fontFamily="'Saans','Helvetica Neue',sans-serif">{fmt(values[i])}</text>
            <text x={x + barW / 2} y={pt + ph + 22} textAnchor="middle" fontSize={11} fill={C.subtitle} fontFamily="'Saans','Helvetica Neue',sans-serif">{lbl}</text>
          </g>
        );
      })}
      <line x1={pl} x2={pl + pw} y1={pt + ph} y2={pt + ph} stroke={C.axisTick} strokeWidth={1.5} />
    </g>
  );
}

function renderRanked(labels: string[], values: number[], C: Record<string, string>, W: number, H: number, hiIdx: number, ptOffset: number) {
  const pt = ptOffset + 16, pb = 16, labelW = Math.min(200, W * 0.28);
  const pl = labelW + 16, pr = 72;
  const ph = H - pt - pb;
  const max = niceMax(Math.max(...values, 1));
  const n = labels.length;
  const barH = Math.min(32, (ph / n) * 0.6);
  const gap = ph / n;
  const autoHi = values.indexOf(Math.max(...values));
  const hiI = hiIdx === -1 ? autoHi : hiIdx;
  return (
    <g>
      {labels.map((lbl, i) => {
        const bw = Math.max(2, (values[i] / max) * (W - pl - pr));
        const y = pt + gap * i + gap / 2 - barH / 2;
        const fill = i === hiI ? C.barAccent : C.barFill;
        const stroke = i === hiI ? '#8a9600' : C.barStroke;
        return (
          <g key={i}>
            <text x={pl - 10} y={y + barH / 2 + 4} textAnchor="end" fontSize={12} fill={C.title} fontFamily="'Saans','Helvetica Neue',sans-serif">{lbl}</text>
            <rect x={pl} y={y} width={bw} height={barH} fill={fill} stroke={stroke} strokeWidth={0.8} />
            <text x={pl + bw + 8} y={y + barH / 2 + 4} fontSize={11} fontWeight="600" fill={C.valueText} fontFamily="'Saans','Helvetica Neue',sans-serif">{fmt(values[i])}</text>
          </g>
        );
      })}
    </g>
  );
}

function renderLine(labels: string[], values: number[], C: Record<string, string>, W: number, H: number, ptOffset: number) {
  const pt = ptOffset + 24, pb = 40, pl = 52, pr = 24;
  const pw = W - pl - pr, ph = H - pt - pb;
  const max = niceMax(Math.max(...values, 1));
  const n = Math.max(labels.length - 1, 1);
  const toX = (i: number) => pl + (i / n) * pw;
  const toY = (v: number) => pt + ph - (v / max) * ph;
  const pts = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  return (
    <g>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pl} x2={pl + pw} y1={pt + ph * f} y2={pt + ph * f} stroke={C.gridLine} strokeWidth={1} />
      ))}
      <polyline points={pts} fill="none" stroke={C.lineStroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={4} fill={C.lineStroke} />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={toX(i)} y={pt + ph + 20} textAnchor="middle" fontSize={11} fill={C.subtitle} fontFamily="'Saans','Helvetica Neue',sans-serif">{l}</text>
      ))}
      <line x1={pl} x2={pl + pw} y1={pt + ph} y2={pt + ph} stroke={C.axisTick} strokeWidth={1.5} />
    </g>
  );
}

function renderPie(labels: string[], values: number[], C: Record<string, string>, W: number, H: number, ptOffset: number) {
  const total = values.reduce((s, v) => s + v, 0) || 1;
  const cy = ptOffset + (H - ptOffset) / 2;
  const r = Math.min((H - ptOffset) / 2 - 24, W * 0.3);
  const cx = r + 48;
  const legendX = cx + r + 48;
  const fills = [C.barFill, C.lineStroke, C.barAccent, C.barStroke, C.axisTick];
  let angle = -Math.PI / 2;
  return (
    <g>
      {values.map((v, i) => {
        const sweep = (v / total) * Math.PI * 2;
        const end = angle + sweep;
        const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const large = sweep > Math.PI ? 1 : 0;
        const mid = angle + sweep / 2;
        const lx = cx + r * 0.62 * Math.cos(mid), ly = cy + r * 0.62 * Math.sin(mid);
        const pct = Math.round((v / total) * 100);
        const fill = fills[i % fills.length];
        angle = end;
        return (
          <g key={i}>
            <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={fill} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
            {pct > 4 && <text x={lx} y={ly + 4} textAnchor="middle" fontSize={12} fontWeight="700" fill={i === 0 ? C.barStroke : '#fff'} fontFamily="'Saans','Helvetica Neue',sans-serif">{pct}%</text>}
          </g>
        );
      })}
      {labels.map((lbl, i) => {
        const rowH = 28, startY = cy - (labels.length * rowH) / 2;
        return (
          <g key={i} transform={`translate(${legendX}, ${startY + i * rowH})`}>
            <rect width={12} height={12} y={2} fill={fills[i % fills.length]} />
            <text x={20} y={13} fontSize={13} fill={C.title} fontFamily="'Saans','Helvetica Neue',sans-serif">{lbl}</text>
          </g>
        );
      })}
    </g>
  );
}

function renderStat(value: string, label: string, sub: string, C: Record<string, string>, W: number, H: number, ptOffset: number) {
  const cy = ptOffset + (H - ptOffset) / 2;
  return (
    <g>
      <text x={W / 2} y={cy - 10} textAnchor="middle" fontSize={96} fontWeight="700" fill={C.barAccent} fontFamily="'Saans','Helvetica Neue',sans-serif">{value}</text>
      <text x={W / 2} y={cy + 56} textAnchor="middle" fontSize={20} fill={C.title} fontFamily="'Saans','Helvetica Neue',sans-serif">{label}</text>
      {sub && <text x={W / 2} y={cy + 88} textAnchor="middle" fontSize={14} fill={C.subtitle} fontFamily="'Saans','Helvetica Neue',sans-serif">{sub}</text>}
    </g>
  );
}

function renderTable(headers: string[], rows: string[][], C: Record<string, string>, W: number, H: number, ptOffset: number) {
  const colW = (W - 80) / (headers.length || 1);
  const rowH = 36;
  const startY = ptOffset + 24;
  return (
    <g>
      {headers.map((h, i) => (
        <g key={i}>
          <rect x={40 + i * colW} y={startY} width={colW} height={rowH} fill={C.barStroke} />
          <text x={40 + i * colW + 12} y={startY + 23} fontSize={12} fontWeight="600" fill="#fff" fontFamily="'Saans Mono','DM Mono',monospace">{h.toUpperCase()}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={ri}>
          <rect x={40} y={startY + (ri + 1) * rowH} width={W - 80} height={rowH} fill={ri % 2 === 0 ? '#fff' : C.bg} />
          {row.map((cell, ci) => (
            <text key={ci} x={40 + ci * colW + 12} y={startY + (ri + 1) * rowH + 23} fontSize={13} fill={C.title} fontFamily="'Saans','Helvetica Neue',sans-serif">{cell}</text>
          ))}
        </g>
      ))}
    </g>
  );
}

// ── Main Slide ────────────────────────────────────────────────────────────────
export default function ChartSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  const cw = data.chartwizState;
  const hasData = !!cw.data?.trim();
  const chartwizUrl = (() => {
    try {
      const snap = {
        type: cw.chartType, title: cw.title, subtitle: cw.subtitle,
        subcopy: cw.subcopy, data: cw.data, colorMode: cw.colorMode,
        painting: cw.painting, layout: cw.layout, showLogo: cw.showLogo,
        showSource: cw.showSource, highlightIndex: cw.highlightIndex,
        w: cw.w, h: cw.h,
      };
      return `https://airops-chartwiz.vercel.app/?data=${btoa(unescape(encodeURIComponent(JSON.stringify(snap))))}`;
    } catch { return 'https://airops-chartwiz.vercel.app/'; }
  })();

  const C = cw.painting ? PAINTING_COLORS : (CW_COLORS[cw.colorMode] ?? CW_COLORS.dark);
  const parsed = parseData(cw.data, cw.chartType);

  // Slide layout constants
  const W = 1280, H = 720;
  const HEADER_H = 88;

  // Title area height — matches Chartwiz proportions scaled to landscape
  const titleFontSize = Math.round(44 * s);
  const subtitleFontSize = Math.round(16 * s);
  const titleLines = (cw.title || '').split('\n').length;
  const titleBlockH = titleLines * (titleFontSize * 1.2) + (cw.subtitle ? subtitleFontSize * 1.6 + 12 : 0) + 64;
  const subcopyH = cw.subcopy ? Math.round(52 * s) : 0;
  const chartOffsetY = HEADER_H + titleBlockH + subcopyH;
  const chartH = H - chartOffsetY - 48;

  const isOnPainting = !!cw.painting;
  const paintingUrl = cw.painting ? `https://airops-chartwiz.vercel.app/paintings/${cw.painting}.jpg` : null;

  return (
    <div
      style={{
        width: W, height: H,
        background: isOnPainting ? '#111' : C.bg,
        position: 'relative', overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      {/* Painting background */}
      {paintingUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paintingUrl}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 100%)' }} />
        </>
      )}

      {/* Header strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 56, paddingRight: 40,
        borderBottom: `1px solid ${C.border}`,
        zIndex: 2,
      }}>
        <div style={{ fontFamily: '"Saans Mono","DM Mono",monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.lineStroke }}>
          {cw.chartType === 'bar' ? 'Bar Chart' : cw.chartType === 'ranked' ? 'Ranked Bar' : cw.chartType === 'line' ? 'Line Chart' : cw.chartType === 'pie' ? 'Pie Chart' : cw.chartType === 'stat' ? 'Stat' : cw.chartType === 'table' ? 'Table' : 'Data Viz'}
        </div>
        <a
          href={chartwizUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ padding: '8px 18px', background: isOnPainting ? 'rgba(0,0,0,0.5)' : C.barStroke, color: C.barAccent, fontFamily: '"Saans Mono","DM Mono",monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0, pointerEvents: interactive ? 'auto' : 'none' }}
        >
          Edit in Chartwiz ↗
        </a>
      </div>

      {/* SVG canvas for title + chart */}
      <svg
        width={W}
        height={H - HEADER_H}
        style={{ position: 'absolute', top: HEADER_H, left: 0, zIndex: 1 }}
      >
        {/* Title */}
        {cw.title && (
          <text
            x={56} y={titleFontSize + 36}
            fontSize={titleFontSize}
            fontWeight="400"
            fill={C.title}
            fontFamily="Georgia, 'Serrif VF', serif"
            letterSpacing="-0.02em"
          >
            {cw.title}
          </text>
        )}

        {/* Subtitle */}
        {cw.subtitle && (
          <text
            x={56}
            y={titleFontSize + 36 + titleFontSize * 1.2 * titleLines + 8}
            fontSize={subtitleFontSize}
            fill={C.subtitle}
            fontFamily="'Saans','Helvetica Neue',sans-serif"
          >
            {cw.subtitle}
          </text>
        )}

        {/* Subcopy callout box */}
        {cw.subcopy && (
          <g transform={`translate(56, ${titleBlockH})`}>
            <rect x={0} y={0} width={W - 112} height={subcopyH} fill="rgba(255,255,255,0.9)" stroke={C.border} strokeWidth={1} />
            <text x={16} y={subcopyH / 2 + 6} fontSize={Math.round(13 * s)} fill="#000d05" fontFamily="'Saans','Helvetica Neue',sans-serif">{cw.subcopy}</text>
          </g>
        )}

        {/* Chart */}
        {hasData ? (
          <>
            {cw.chartType === 'bar' && renderBar(parsed.labels, parsed.values, C, W, H - HEADER_H, cw.highlightIndex, chartOffsetY - HEADER_H)}
            {cw.chartType === 'ranked' && renderRanked(parsed.labels, parsed.values, C, W, H - HEADER_H, cw.highlightIndex, chartOffsetY - HEADER_H)}
            {cw.chartType === 'line' && renderLine(parsed.labels, parsed.values, C, W, H - HEADER_H, chartOffsetY - HEADER_H)}
            {cw.chartType === 'pie' && renderPie(parsed.labels, parsed.values, C, W, H - HEADER_H, chartOffsetY - HEADER_H)}
            {cw.chartType === 'stat' && renderStat(parsed.value ?? '—', parsed.label ?? '', parsed.sub ?? '', C, W, H - HEADER_H, chartOffsetY - HEADER_H)}
            {cw.chartType === 'table' && parsed.headers && renderTable(parsed.headers, parsed.rows ?? [], C, W, H - HEADER_H, chartOffsetY - HEADER_H)}
          </>
        ) : (
          <text x={W / 2} y={(H - HEADER_H) / 2} textAnchor="middle" fontSize={18} fill={C.subtitle} fontFamily="Georgia,serif">
            Build your chart in Chartwiz, then paste the URL here
          </text>
        )}

        {/* Source line */}
        {cw.showSource && cw.subtitle && (
          <text
            x={56} y={H - HEADER_H - 24}
            fontSize={10} fontWeight="500" letterSpacing="0.06em"
            fill={C.subtitle}
            fontFamily="'Saans Mono','DM Mono',monospace"
          >
            {cw.subtitle.toUpperCase()}
          </text>
        )}
      </svg>

      {/* AirOps Research logo */}
      {cw.showLogo && !data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 24, right: 40, zIndex: 2 }}>
          <AirOpsLogo color={C.logoFill} width={72} />
        </div>
      )}

      {/* Slide headline override (shown in header) */}
      {data.headline && data.headline !== cw.title && (
        <div
          {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
          style={{ position: 'absolute', top: HEADER_H + 8, left: 56, right: 200, fontSize: Math.round(36 * s), fontFamily: '"Serrif VF",Georgia,serif', color: C.title, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, outline: 'none', cursor: onUpdate ? 'text' : 'default', zIndex: 3, display: 'none' }}
        />
      )}

      {/* Bottom accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: '#00ff64', zIndex: 10 }} />
    </div>
  );
}
