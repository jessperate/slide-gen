'use client';

import { ContentSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ContentSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ContentSlideData>) => void;
  theme?: SlideTheme;
}

export default function ContentSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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
        <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent }} />

      {/* Headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 64,
          left: 64,
          right: 64,
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

      {/* Divider */}
      <div
        style={{
          position: 'absolute',
          top: 144,
          left: 64,
          right: 64,
          height: 1,
          background: theme.stroke,
        }}
      />

      {/* Columns */}
      <div
        style={{
          position: 'absolute',
          top: 168,
          left: 64,
          right: 64,
          bottom: 96,
          display: 'flex',
          gap: 0,
        }}
      >
        {data.columns.map((col, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              paddingRight: i < data.columns.length - 1 ? 48 : 0,
              paddingLeft: i > 0 ? 48 : 0,
              borderLeft: i > 0 ? `1px solid ${theme.stroke}` : 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Accent dot */}
            <div
              style={{
                width: 8,
                height: 8,
                background: theme.accentMid,
                marginBottom: 16,
                flexShrink: 0,
              }}
            />
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.columns];
                next[i] = { ...next[i], heading: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, columns: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 18,
                fontWeight: 600,
                color: theme.textOnLight,
                marginBottom: 16,
                lineHeight: 1.3,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {col.heading}
            </div>
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
                fontSize: 15,
                fontWeight: 400,
                color: theme.bodyOnLight,
                lineHeight: 1.65,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {col.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
