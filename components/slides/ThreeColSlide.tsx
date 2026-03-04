'use client';

import { ThreeColSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ThreeColSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ThreeColSlideData>) => void;
  theme?: SlideTheme;
}

export default function ThreeColSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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

      {/* Page headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 48,
          left: 64,
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

      {/* Full-width horizontal rule */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 64,
          right: 64,
          height: 1,
          background: theme.stroke,
        }}
      />

      {/* Columns container */}
      <div
        style={{
          position: 'absolute',
          top: 144,
          left: 64,
          right: 64,
          bottom: 80,
          display: 'flex',
          flexDirection: 'row',
          gap: 0,
        }}
      >
        {data.columns.map((col, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              paddingTop: 24,
              paddingRight: i < data.columns.length - 1 ? 32 : 0,
              paddingLeft: i > 0 ? 32 : 0,
              borderLeft: i > 0 ? `1px solid ${theme.stroke}` : 'none',
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 32,
                color: theme.accentMid,
                marginBottom: 8,
                lineHeight: 1,
              }}
            >
              {col.icon.startsWith('ri-') ? <i className={col.icon} /> : col.icon}
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
                fontFamily: '"Saans", sans-serif',
                fontSize: 18,
                fontWeight: 500,
                color: theme.textOnLight,
                marginBottom: 8,
                lineHeight: 1.3,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {col.header}
            </div>

            {/* Rule below header */}
            <div
              style={{
                width: '100%',
                height: 1,
                background: theme.stroke,
                marginBottom: 16,
              }}
            />

            {/* Body */}
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
                fontSize: 14,
                fontWeight: 400,
                color: theme.mutedOnLight,
                lineHeight: 1.6,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
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
