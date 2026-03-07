'use client';

import LZString from 'lz-string';
import { ChartSlideData, ChartRow } from '@/lib/slides';
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
    theme: 'mint',
    size: 'landscape',
    logoType: 'airops',
    showStats: false,
    showChart: true,
    border: true,
    highlight: '',
    opts: { grid: true, legend: true, labels: true, yMin: '', yMax: '' },
    yAxisLabel: '',
    xAxisLabel: '',
    refLine: { enabled: false, value: 50, label: 'Reference' },
    statCards: [],
    compRows: [],
    vertRows: [],
    lineSeries: [],
    pieRows: [],
    stkCols: [],
    stkSegs: [],
    slopeRows: [],
    slopeLeftLabel: 'Before',
    slopeRightLabel: 'After',
    lineSmooth: false,
    ...state,
  };
  return `https://airops-chartwiz.vercel.app/#s=${LZString.compressToEncodedURIComponent(JSON.stringify(fullState))}`;
}

function getPreviewRows(state: ChartSlideData['chartwizState']): ChartRow[] {
  const ct = state.chartType;
  if (ct === 'vertical') return (state.vertRows ?? []).slice(0, 7);
  if (ct === 'horizontal') return (state.compRows ?? []).slice(0, 7);
  if (ct === 'pie') return (state.pieRows ?? []).slice(0, 7);
  if (ct === 'slope') return (state.slopeRows ?? []).slice(0, 7).map(r => ({ label: r.name, value: r.right }));
  if (ct === 'line') {
    const series = state.lineSeries?.[0];
    if (!series) return [];
    return series.pts.slice(0, 7).map(p => ({ label: String(p.x), value: p.y }));
  }
  if (ct === 'stacked') {
    const cols = state.stkCols ?? [];
    const segs = state.stkSegs ?? [];
    return cols.slice(0, 7).map((col, i) => ({
      label: col,
      value: segs.reduce((sum, seg) => sum + (seg.values[i] ?? 0), 0),
    }));
  }
  return [];
}

const CHART_TYPE_LABELS: Record<string, string> = {
  vertical: 'Bar chart',
  horizontal: 'Horizontal bar',
  line: 'Line chart',
  pie: 'Pie chart',
  stacked: 'Stacked bar',
  slope: 'Slope chart',
};

export default function ChartSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  const rows = getPreviewRows(data.chartwizState);
  const maxVal = Math.max(...rows.map(r => r.value), 1);
  const chartwizUrl = buildChartwizUrl(data.chartwizState);
  const chartTypeLabel = CHART_TYPE_LABELS[data.chartwizState.chartType] ?? 'Chart';

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: theme.lightBg,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* Logo */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* Headline strip */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 108,
          background: theme.lightBg,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 64,
          paddingRight: 48,
          justifyContent: 'space-between',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{
            fontFamily: '"Saans Mono", monospace',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: theme.accentMid,
          }}>
            {chartTypeLabel}
          </div>
          <div
            {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
            style={{
              fontFamily: '"Serrif VF", serif',
              fontSize: Math.round(40 * s),
              fontWeight: 400,
              color: theme.textOnLight,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          />
        </div>

        {/* Open in Chartwiz */}
        <a
          href={chartwizUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: theme.darkBg,
            color: theme.accent,
            fontFamily: '"Saans Mono", monospace',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            flexShrink: 0,
            pointerEvents: interactive ? 'auto' : 'none',
            whiteSpace: 'nowrap',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Open in Chartwiz ↗
        </a>
      </div>

      {/* Divider */}
      <div style={{ position: 'absolute', top: 108, left: 64, right: 64, height: 1, background: theme.stroke }} />

      {/* Body */}
      <div
        style={{
          position: 'absolute',
          top: 109,
          left: 0,
          right: 0,
          bottom: 72,
          display: 'flex',
        }}
      >
        {/* Left: description */}
        <div style={{
          width: 300,
          flexShrink: 0,
          padding: '40px 28px 40px 64px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {data.description ? (
            <div
              {...richTextProps(data.description ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, description: html }))}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: Math.round(15 * s),
                color: theme.bodyOnLight,
                lineHeight: 1.65,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderLeft: `3px solid ${theme.accentMid}`,
                paddingLeft: 18,
              }}
            />
          ) : (
            <div style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              color: theme.mutedOnLight,
              borderLeft: `3px solid ${theme.stroke}`,
              paddingLeft: 18,
              fontStyle: 'italic',
            }}>
              Add a description
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, background: theme.stroke, flexShrink: 0, margin: '24px 0' }} />

        {/* Right: bar preview */}
        <div style={{
          flex: 1,
          padding: '32px 80px 32px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 12,
        }}>
          {rows.length > 0 ? rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 130,
                fontFamily: '"Saans", sans-serif',
                fontSize: 12,
                color: theme.mutedOnLight,
                textAlign: 'right',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {row.label}
              </div>
              <div style={{ flex: 1, height: 26, background: theme.stroke, position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  height: '100%',
                  width: `${(row.value / maxVal) * 100}%`,
                  background: i === 0
                    ? theme.darkBg
                    : i === 1
                    ? theme.accentMid
                    : `${theme.accentMid}99`,
                }} />
              </div>
              <div style={{
                width: 44,
                fontFamily: '"Saans Mono", monospace',
                fontSize: 11,
                fontWeight: 600,
                color: theme.textOnLight,
                flexShrink: 0,
                textAlign: 'left',
              }}>
                {row.value}
              </div>
            </div>
          )) : (
            <div style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              color: theme.mutedOnLight,
              textAlign: 'center',
            }}>
              Click "Open in Chartwiz" to configure your chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
