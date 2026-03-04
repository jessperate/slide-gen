'use client';

import { DiagramSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: DiagramSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<DiagramSlideData>) => void;
}

const COLUMN_ACCENTS = ['#002910', '#008c44', '#00ff64'];
const COLUMN_TEXT_ON_ACCENT = ['#00ff64', '#ffffff', '#002910'];

export default function DiagramSlide({ data, interactive = true, onUpdate }: Props) {
  const colCount = data.columns.length;
  const colWidth = Math.floor(1280 / colCount);

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#EEF5F1',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* AirOps logo bottom-left */}
      <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
        <AirOpsLogo color="#001408" width={80} />
      </div>

      {/* Green bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#00ff64', zIndex: 10 }} />

      {/* Headline — top strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          background: '#EEF5F1',
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
            color: '#000d05',
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
          const accent = COLUMN_ACCENTS[i % COLUMN_ACCENTS.length];
          const accentText = COLUMN_TEXT_ON_ACCENT[i % COLUMN_TEXT_ON_ACCENT.length];
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: i > 0 ? '1px solid #d4e8da' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Colored header band */}
              <div
                style={{
                  background: accent,
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
                    color: accentText,
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
                    fontSize: 32,
                    fontWeight: 400,
                    color: accentText,
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
                  background: i % 2 === 1 ? '#ffffff' : '#EEF5F1',
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
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#1a2e20',
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
                      color: '#008c44',
                      background: 'transparent',
                      border: '1px solid #008c44',
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
