'use client';

import { ChecklistSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ChecklistSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ChecklistSlideData>) => void;
  theme?: SlideTheme;
}

export default function ChecklistSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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

      {/* Items */}
      <div
        style={{
          position: 'absolute',
          top: 144,
          left: 64,
          right: 64,
        }}
      >
        {data.items.map((item, i) => (
          <div
            key={i}
            style={{
              height: 88,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${theme.stroke}`,
              gap: 0,
            }}
          >
            {/* Checkbox */}
            <div
              onClick={() => {
                const next = [...data.items];
                next[i] = { ...next[i], checked: !next[i].checked };
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                width: 24,
                height: 24,
                border: `2px solid ${theme.accentMid}`,
                background: item.checked ? theme.accentMid : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: '#ffffff',
                lineHeight: 1,
                cursor: onUpdate ? 'pointer' : 'default',
                userSelect: 'none',
              }}
            >
              {item.checked ? '✓' : ''}
            </div>

            {/* Title */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.items];
                next[i] = { ...next[i], title: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: theme.textOnLight,
                marginLeft: 16,
                width: 240,
                flexShrink: 0,
                lineHeight: 1.3,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {item.title}
            </div>

            {/* Body */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.items];
                next[i] = { ...next[i], body: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 400,
                color: theme.mutedOnLight,
                lineHeight: 1.5,
                flex: 1,
                marginLeft: 24,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
