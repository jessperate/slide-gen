'use client';

import { TableSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: TableSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<TableSlideData>) => void;
  theme?: SlideTheme;
}

export default function TableSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  const colCount = data.headers.length;
  const rowCount = data.rows.length;

  // Scale font sizes down if many columns or rows
  const headerFontSize = Math.round(Math.min(13, 16 - colCount) * s);
  const cellFontSize = Math.round(Math.min(14, 17 - colCount) * s);
  const headerPadV = rowCount > 6 ? 12 : 16;
  const rowPadV = rowCount > 6 ? 10 : 14;

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
      {/* AirOps logo bottom-left */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 64,
          paddingRight: 64,
          background: theme.lightBg,
          zIndex: 5,
        }}
      >
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

      {/* Table */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 64,
          right: 64,
          bottom: 72,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            background: theme.darkBg,
            flexShrink: 0,
          }}
        >
          {data.headers.map((header, ci) => (
            <div
              key={ci}
              style={{
                flex: 1,
                padding: `${headerPadV}px 20px`,
                borderRight: ci < colCount - 1 ? `1px solid rgba(255,255,255,0.1)` : 'none',
              }}
            >
              <div
                {...richTextProps(header ?? '', !!onUpdate, (html) => {
                  const next = [...data.headers];
                  next[ci] = html;
                  onUpdate?.({ ...data, headers: next });
                })}
                style={{
                  fontFamily: '"Saans Mono", monospace',
                  fontSize: headerFontSize,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: theme.accent,
                  outline: 'none',
                  cursor: onUpdate ? 'text' : 'default',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {data.rows.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: 'flex',
                flex: 1,
                background: ri % 2 === 0 ? theme.lightBg : '#ffffff',
                borderBottom: `1px solid ${theme.stroke}`,
              }}
            >
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  style={{
                    flex: 1,
                    padding: `${rowPadV}px 20px`,
                    borderRight: ci < colCount - 1 ? `1px solid ${theme.stroke}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    // First column is slightly emphasized
                    ...(ci === 0
                      ? { borderLeft: `3px solid ${theme.accentMid}` }
                      : {}),
                  }}
                >
                  <div
                    {...richTextProps(cell ?? '', !!onUpdate, (html) => {
                      const nextRows = data.rows.map((r, rr) =>
                        rr === ri ? r.map((c, cc) => (cc === ci ? html : c)) : r
                      );
                      onUpdate?.({ ...data, rows: nextRows });
                    })}
                    style={{
                      fontFamily: '"Saans", sans-serif',
                      fontSize: cellFontSize,
                      fontWeight: ci === 0 ? 500 : 400,
                      color: ci === 0 ? theme.textOnLight : theme.bodyOnLight,
                      lineHeight: 1.4,
                      outline: 'none',
                      cursor: onUpdate ? 'text' : 'default',
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
