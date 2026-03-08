'use client';

import LZString from 'lz-string';
import { ChartSlideData, ChartRow, ChartLineSeries, ChartSlopeRow, ChartStkSeg } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: ChartSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ChartSlideData>) => void;
  theme?: SlideTheme;
}

function buildChartwizUrl(state: ChartSlideData['chartwizState']): string {
  const fullState = {
    theme: 'mint', size: 'landscape', logoType: 'airops',
    showStats: false, showChart: true, border: false, highlight: '',
    opts: { grid: true, legend: true, labels: true, yMin: '', yMax: '' },
    yAxisLabel: '', xAxisLabel: '',
    refLine: { enabled: false, value: 50, label: 'Reference' },
    statCards: [], compRows: [], vertRows: [], lineSeries: [],
    pieRows: [], stkCols: [], stkSegs: [], slopeRows: [],
    slopeLeftLabel: 'Before', slopeRightLabel: 'After', lineSmooth: false,
    ...state,
  };
  return `https://airops-chartwiz.vercel.app/#s=${LZString.compressToEncodedURIComponent(JSON.stringify(fullState))}`;
}

function hasChartData(state: ChartSlideData['chartwizState']): boolean {
  const ct = state.chartType;
  if (ct === 'vertical') return (state.vertRows?.length ?? 0) > 0;
  if (ct === 'horizontal') return (state.compRows?.length ?? 0) > 0;
  if (ct === 'pie') return (state.pieRows?.length ?? 0) > 0;
  if (ct === 'line') return (state.lineSeries?.length ?? 0) > 0;
  if (ct === 'stacked') return (state.stkCols?.length ?? 0) > 0;
  if (ct === 'slope') return (state.slopeRows?.length ?? 0) > 0;
  return false;
}

function niceMax(max: number): number {
  if (max <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
}

function fmt(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(Math.round(v * 10) / 10);
}

function palette(theme: SlideTheme): string[] {
  return [theme.accentMid, theme.darkBg, '#5B8DB8', '#C9A96E', '#9B59B6', '#E86C4F'];
}

// ─── Vertical Bar ────────────────────────────────────────────────────────────
function VertBar({ rows, w, h, theme }: { rows: ChartRow[]; w: number; h: number; theme: SlideTheme }) {
  const cols = palette(theme);
  const pt = 28, pb = 44, pl = 56, pr = 24;
  const pw = w - pl - pr, ph = h - pt - pb;
  const max = niceMax(Math.max(...rows.map(r => r.value), 1));
  const barW = Math.min(72, (pw / rows.length) * 0.55);
  const gap = pw / rows.length;
  const GRID = 4;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {Array.from({ length: GRID + 1 }, (_, i) => {
        const y = pt + (ph * i) / GRID;
        return (
          <g key={i}>
            <line x1={pl} x2={pl + pw} y1={y} y2={y} stroke={theme.stroke} strokeWidth={1} />
            <text x={pl - 8} y={y + 4} textAnchor="end" fontSize={10} fill={theme.mutedOnLight}>{fmt(max * (1 - i / GRID))}</text>
          </g>
        );
      })}
      {rows.map((row, i) => {
        const barH = Math.max(2, (row.value / max) * ph);
        const x = pl + gap * i + gap / 2 - barW / 2;
        const y = pt + ph - barH;
        const color = cols[i % cols.length];
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={color} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight="600" fill={color}>{fmt(row.value)}</text>
            <text x={x + barW / 2} y={pt + ph + 22} textAnchor="middle" fontSize={11} fill={theme.bodyOnLight}>{row.label}</text>
          </g>
        );
      })}
      <line x1={pl} x2={pl + pw} y1={pt + ph} y2={pt + ph} stroke={theme.stroke} strokeWidth={1.5} />
    </svg>
  );
}

// ─── Horizontal Bar ──────────────────────────────────────────────────────────
function HorizBar({ rows, w, h, theme }: { rows: ChartRow[]; w: number; h: number; theme: SlideTheme }) {
  const cols = palette(theme);
  const pt = 16, pb = 16, labelW = 160;
  const pl = labelW + 20, pr = 80;
  const ph = h - pt - pb;
  const pw = w - pl - pr;
  const max = niceMax(Math.max(...rows.map(r => r.value), 1));
  const barH = Math.min(36, (ph / rows.length) * 0.6);
  const gap = ph / rows.length;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {rows.map((row, i) => {
        const bw = Math.max(2, (row.value / max) * pw);
        const y = pt + gap * i + gap / 2 - barH / 2;
        const color = cols[i % cols.length];
        return (
          <g key={i}>
            <text x={pl - 12} y={y + barH / 2 + 4} textAnchor="end" fontSize={12} fill={theme.bodyOnLight}>{row.label}</text>
            <rect x={pl} y={y} width={bw} height={barH} fill={color} />
            <text x={pl + bw + 8} y={y + barH / 2 + 4} fontSize={11} fontWeight="600" fill={color}>{fmt(row.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Pie Chart ───────────────────────────────────────────────────────────────
function PieChart({ rows, w, h, theme }: { rows: ChartRow[]; w: number; h: number; theme: SlideTheme }) {
  const cols = palette(theme);
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const r = Math.min(h / 2 - 20, w * 0.38);
  const cx = r + 40, cy = h / 2;
  const legendX = cx + r + 56;
  let angle = -Math.PI / 2;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {rows.map((row, i) => {
        const sweep = (row.value / total) * Math.PI * 2;
        const end = angle + sweep;
        const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const large = sweep > Math.PI ? 1 : 0;
        const mid = angle + sweep / 2;
        const lx = cx + r * 0.62 * Math.cos(mid), ly = cy + r * 0.62 * Math.sin(mid);
        const pct = Math.round((row.value / total) * 100);
        const color = cols[i % cols.length];
        angle = end;
        return (
          <g key={i}>
            <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={color} stroke="white" strokeWidth={2} />
            {pct > 4 && <text x={lx} y={ly + 4} textAnchor="middle" fontSize={12} fontWeight="700" fill="white">{pct}%</text>}
          </g>
        );
      })}
      {rows.map((row, i) => {
        const rowH = 30, startY = cy - (rows.length * rowH) / 2;
        const color = cols[i % cols.length];
        return (
          <g key={i} transform={`translate(${legendX}, ${startY + i * rowH})`}>
            <rect width={14} height={14} y={2} fill={color} />
            <text x={22} y={13} fontSize={13} fill={theme.bodyOnLight}>{row.label}</text>
            <text x={260} y={13} fontSize={13} fontWeight="600" fill={color} textAnchor="end">{fmt(row.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Line Chart ──────────────────────────────────────────────────────────────
function LineChart({ series, w, h, theme }: { series: ChartLineSeries[]; w: number; h: number; theme: SlideTheme }) {
  const cols = palette(theme);
  const pt = 28, pb = series.length > 1 ? 52 : 40, pl = 56, pr = 24;
  const pw = w - pl - pr, ph = h - pt - pb;
  const allY = series.flatMap(s => s.pts.map(p => p.y));
  const maxY = niceMax(Math.max(...allY, 1));
  const labels = series[0]?.pts.map(p => String(p.x)) ?? [];
  const n = Math.max(labels.length - 1, 1);
  const GRID = 4;
  const toX = (i: number) => pl + (i / n) * pw;
  const toY = (v: number) => pt + ph - (v / maxY) * ph;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {Array.from({ length: GRID + 1 }, (_, i) => {
        const y = pt + (ph * i) / GRID;
        return (
          <g key={i}>
            <line x1={pl} x2={pl + pw} y1={y} y2={y} stroke={theme.stroke} strokeWidth={1} />
            <text x={pl - 8} y={y + 4} textAnchor="end" fontSize={10} fill={theme.mutedOnLight}>{fmt(maxY * (1 - i / GRID))}</text>
          </g>
        );
      })}
      {series.map((s, si) => {
        const color = cols[si % cols.length];
        const pts = s.pts.map((p, i) => `${toX(i)},${toY(p.y)}`).join(' ');
        return (
          <g key={si}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {s.pts.map((p, i) => <circle key={i} cx={toX(i)} cy={toY(p.y)} r={4} fill={color} />)}
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={i} x={toX(i)} y={pt + ph + 20} textAnchor="middle" fontSize={11} fill={theme.bodyOnLight}>{l}</text>
      ))}
      <line x1={pl} x2={pl + pw} y1={pt + ph} y2={pt + ph} stroke={theme.stroke} strokeWidth={1.5} />
      {series.length > 1 && series.map((s, i) => (
        <g key={i} transform={`translate(${pl + i * 160}, ${h - 12})`}>
          <line x1={0} x2={16} y1={6} y2={6} stroke={cols[i % cols.length]} strokeWidth={2.5} />
          <circle cx={8} cy={6} r={3} fill={cols[i % cols.length]} />
          <text x={22} y={10} fontSize={11} fill={theme.bodyOnLight}>{s.name}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Stacked Bar ─────────────────────────────────────────────────────────────
function StackedBar({ cols: colLabels, segs, w, h, theme }: { cols: string[]; segs: ChartStkSeg[]; w: number; h: number; theme: SlideTheme }) {
  const colors = palette(theme);
  const pt = 28, pb = segs.length > 1 ? 52 : 44, pl = 56, pr = 24;
  const pw = w - pl - pr, ph = h - pt - pb;
  const totals = colLabels.map((_, i) => segs.reduce((s, seg) => s + (seg.values[i] ?? 0), 0));
  const max = niceMax(Math.max(...totals, 1));
  const barW = Math.min(72, (pw / colLabels.length) * 0.55);
  const gap = pw / colLabels.length;
  const GRID = 4;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {Array.from({ length: GRID + 1 }, (_, i) => {
        const y = pt + (ph * i) / GRID;
        return (
          <g key={i}>
            <line x1={pl} x2={pl + pw} y1={y} y2={y} stroke={theme.stroke} strokeWidth={1} />
            <text x={pl - 8} y={y + 4} textAnchor="end" fontSize={10} fill={theme.mutedOnLight}>{fmt(max * (1 - i / GRID))}</text>
          </g>
        );
      })}
      {colLabels.map((col, ci) => {
        const x = pl + gap * ci + gap / 2 - barW / 2;
        let yo = pt + ph;
        return (
          <g key={ci}>
            {segs.map((seg, si) => {
              const val = seg.values[ci] ?? 0;
              const bh = (val / max) * ph;
              yo -= bh;
              return <rect key={si} x={x} y={yo} width={barW} height={bh} fill={colors[si % colors.length]} />;
            })}
            <text x={x + barW / 2} y={pt + ph + 22} textAnchor="middle" fontSize={11} fill={theme.bodyOnLight}>{col}</text>
          </g>
        );
      })}
      <line x1={pl} x2={pl + pw} y1={pt + ph} y2={pt + ph} stroke={theme.stroke} strokeWidth={1.5} />
      {segs.length > 1 && segs.map((seg, i) => (
        <g key={i} transform={`translate(${pl + i * 160}, ${h - 12})`}>
          <rect width={12} height={12} fill={colors[i % colors.length]} />
          <text x={18} y={10} fontSize={11} fill={theme.bodyOnLight}>{seg.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Slope Chart ─────────────────────────────────────────────────────────────
function SlopeChart({ rows, leftLabel, rightLabel, w, h, theme }: { rows: ChartSlopeRow[]; leftLabel: string; rightLabel: string; w: number; h: number; theme: SlideTheme }) {
  const colors = palette(theme);
  const pt = 48, pb = 16, nameW = 140, valueW = 56;
  const ph = h - pt - pb;
  const lx = nameW + valueW + 20, rx = w - valueW - 40;
  const allVals = rows.flatMap(r => [r.left, r.right]);
  const minV = Math.min(...allVals, 0);
  const maxV = niceMax(Math.max(...allVals, 1));
  const range = maxV - minV || 1;
  const toY = (v: number) => pt + ph - ((v - minV) / range) * ph;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <text x={lx} y={pt - 14} textAnchor="middle" fontSize={13} fontWeight="600" fill={theme.textOnLight}>{leftLabel}</text>
      <text x={rx} y={pt - 14} textAnchor="middle" fontSize={13} fontWeight="600" fill={theme.textOnLight}>{rightLabel}</text>
      <line x1={lx} x2={lx} y1={pt} y2={pt + ph} stroke={theme.stroke} strokeWidth={1} />
      <line x1={rx} x2={rx} y1={pt} y2={pt + ph} stroke={theme.stroke} strokeWidth={1} />
      {rows.map((row, i) => {
        const y1 = toY(row.left), y2 = toY(row.right);
        const color = colors[i % colors.length];
        return (
          <g key={i}>
            <line x1={lx} x2={rx} y1={y1} y2={y2} stroke={color} strokeWidth={2} strokeOpacity={0.85} />
            <circle cx={lx} cy={y1} r={5} fill={color} />
            <circle cx={rx} cy={y2} r={5} fill={color} />
            <text x={lx - 10} y={y1 + 4} textAnchor="end" fontSize={11} fontWeight="600" fill={color}>{fmt(row.left)}</text>
            <text x={rx + 10} y={y2 + 4} fontSize={11} fontWeight="600" fill={color}>{fmt(row.right)}</text>
            <text x={nameW + valueW} y={y1 + 4} textAnchor="end" fontSize={11} fill={theme.bodyOnLight}>{row.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────
function renderChart(state: ChartSlideData['chartwizState'], w: number, h: number, theme: SlideTheme): React.ReactElement | null {
  const ct = state.chartType;
  if (ct === 'vertical' && state.vertRows?.length) return <VertBar rows={state.vertRows} w={w} h={h} theme={theme} />;
  if (ct === 'horizontal' && state.compRows?.length) return <HorizBar rows={state.compRows} w={w} h={h} theme={theme} />;
  if (ct === 'pie' && state.pieRows?.length) return <PieChart rows={state.pieRows} w={w} h={h} theme={theme} />;
  if (ct === 'line' && state.lineSeries?.length) return <LineChart series={state.lineSeries} w={w} h={h} theme={theme} />;
  if (ct === 'stacked' && state.stkCols?.length) return <StackedBar cols={state.stkCols} segs={state.stkSegs ?? []} w={w} h={h} theme={theme} />;
  if (ct === 'slope' && state.slopeRows?.length) return <SlopeChart rows={state.slopeRows} leftLabel={state.slopeLeftLabel ?? 'Before'} rightLabel={state.slopeRightLabel ?? 'After'} w={w} h={h} theme={theme} />;
  return null;
}

const CHART_TYPE_LABELS: Record<string, string> = {
  vertical: 'Bar chart', horizontal: 'Horizontal bar', line: 'Line chart',
  pie: 'Pie chart', stacked: 'Stacked bar', slope: 'Slope chart',
};

// ─── Slide ───────────────────────────────────────────────────────────────────
export default function ChartSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  const chartwizUrl = buildChartwizUrl(data.chartwizState);
  const chartTypeLabel = CHART_TYPE_LABELS[data.chartwizState.chartType] ?? 'Chart';
  const hasData = hasChartData(data.chartwizState);
  const hasDesc = !!data.description;

  const HEADER_H = 96;
  const BOTTOM_H = 72;
  const SIDE_PAD = 64;
  const DESC_W = 256;

  // chart SVG dimensions — computed from available space
  const chartAreaX = hasDesc ? SIDE_PAD + DESC_W + 17 : SIDE_PAD;
  const chartW = 1280 - chartAreaX - SIDE_PAD;
  const chartH = 720 - HEADER_H - BOTTOM_H - 40;

  return (
    <div
      style={{
        width: 1280, height: 720,
        background: theme.lightBg,
        position: 'relative', overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
        display: 'flex', alignItems: 'center',
        paddingLeft: SIDE_PAD, paddingRight: 48,
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.stroke}`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: theme.accentMid }}>
            {chartTypeLabel}
          </div>
          <div
            {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
            style={{ fontFamily: '"Serrif VF", serif', fontSize: Math.round(36 * s), fontWeight: 400, color: theme.textOnLight, letterSpacing: '-0.02em', lineHeight: 1.1, outline: 'none', cursor: onUpdate ? 'text' : 'default' }}
          />
        </div>
        <a
          href={chartwizUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', background: theme.darkBg, color: theme.accent, fontFamily: '"Saans Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap', pointerEvents: interactive ? 'auto' : 'none' }}
        >
          Open in Chartwiz ↗
        </a>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: HEADER_H, left: 0, right: 0, bottom: BOTTOM_H, display: 'flex' }}>
        {/* Description panel */}
        {hasDesc && (
          <>
            <div style={{ width: SIDE_PAD + DESC_W, flexShrink: 0, padding: `32px 24px 24px ${SIDE_PAD}px`, display: 'flex', alignItems: 'center' }}>
              <div
                {...richTextProps(data.description ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, description: html }))}
                style={{ fontFamily: '"Saans", sans-serif', fontSize: Math.round(14 * s), color: theme.bodyOnLight, lineHeight: 1.65, borderLeft: `3px solid ${theme.accentMid}`, paddingLeft: 16, outline: 'none', cursor: onUpdate ? 'text' : 'default' }}
              />
            </div>
            <div style={{ width: 1, background: theme.stroke, flexShrink: 0, margin: '24px 0' }} />
          </>
        )}

        {/* Chart area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `20px ${SIDE_PAD}px 20px ${hasDesc ? 32 : SIDE_PAD}px` }}>
          {hasData ? (
            renderChart(data.chartwizState, chartW, chartH, theme)
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: '"Serrif VF", serif', fontSize: 24, color: theme.mutedOnLight, letterSpacing: '-0.01em' }}>
                Build your chart in Chartwiz, then paste the link back
              </div>
              <a
                href={chartwizUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: '12px 28px', background: theme.darkBg, color: theme.accent, fontFamily: '"Saans Mono", monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, textDecoration: 'none', pointerEvents: interactive ? 'auto' : 'none' }}
              >
                Open in Chartwiz ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
