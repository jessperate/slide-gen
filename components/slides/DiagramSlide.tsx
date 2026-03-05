'use client';

import { DiagramSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: DiagramSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<DiagramSlideData>) => void;
  theme?: SlideTheme;
}

export default function DiagramSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
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

      {/* Headline — top strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          background: theme.lightBg,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 64,
          zIndex: 5,
        }}
      >
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 44,
            fontWeight: 400,
            color: theme.textOnLight,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.headline}
        </div>
      </div>

      {/* Full-height columns — below headline */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          bottom: 6,
          display: 'flex',
        }}
      >
        {data.columns.map((col, i) => {
          const colTheme = theme.diagramColBgs[i % theme.diagramColBgs.length];
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: i > 0 ? `1px solid ${theme.stroke}` : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Colored header band */}
              <div
                style={{
                  background: colTheme.bg,
                  padding: '32px 40px 28px',
                  flexShrink: 0,
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    fontFamily: '"Saans Mono", monospace',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    color: colTheme.text,
                    opacity: 0.5,
                    marginBottom: 12,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Column header */}
                <div
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...data.columns];
                    next[i] = { ...next[i], header: e.currentTarget.textContent ?? '' };
                    onUpdate?.({ ...data, columns: next });
                  }}
                  style={{
                    fontFamily: '"Serrif VF", serif',
                    fontSize: Math.round(32 * s),
                    fontWeight: 400,
                    color: colTheme.text,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.15,
                    outline: 'none',
                    cursor: onUpdate ? 'text' : 'default',
                  }}
                >
                  {col.header}
                </div>
              </div>

              {/* Body content area */}
              <div
                style={{
                  flex: 1,
                  padding: '32px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: i % 2 === 1 ? '#ffffff' : theme.lightBg,
                }}
              >
                <div
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...data.columns];
                    next[i] = { ...next[i], body: e.currentTarget.textContent ?? '' };
                    onUpdate?.({ ...data, columns: next });
                  }}
                  style={{
                    fontFamily: '"Saans", sans-serif',
                    fontSize: Math.round(16 * s),
                    fontWeight: 400,
                    color: theme.bodyOnLight,
                    lineHeight: 1.65,
                    outline: 'none',
                    cursor: onUpdate ? 'text' : 'default',
                  }}
                >
                  {col.body}
                </div>

                {/* Tag */}
                {col.tag !== undefined && (
                  <div
                    contentEditable={!!onUpdate}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const next = [...data.columns];
                      next[i] = { ...next[i], tag: e.currentTarget.textContent ?? '' };
                      onUpdate?.({ ...data, columns: next });
                    }}
                    style={{
                      display: 'inline-block',
                      alignSelf: 'flex-start',
                      fontFamily: '"Saans Mono", monospace',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: theme.accentMid,
                      background: 'transparent',
                      border: `1px solid ${theme.accentMid}`,
                      padding: '5px 12px',
                      outline: 'none',
                      cursor: onUpdate ? 'text' : 'default',
                      marginTop: 24,
                    }}
                  >
                    {col.tag}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
