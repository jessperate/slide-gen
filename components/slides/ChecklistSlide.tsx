'use client';

import { ChecklistSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: ChecklistSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ChecklistSlideData>) => void;
  theme?: SlideTheme;
}

export default function ChecklistSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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
        <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent }} />

      {/* Headline */}
      <div
        {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
        style={{
          position: 'absolute',
          top: 48,
          left: 64,
          fontFamily: '"Serrif VF", serif',
          fontSize: Math.round(44 * s),
          fontWeight: 400,
          color: theme.textOnLight,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
        }}
      />

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
              height: Math.round(88 * s),
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
              {...richTextProps(item.title ?? '', !!onUpdate, (html) => {
                const next = [...data.items];
                next[i] = { ...next[i], title: html };
                onUpdate?.({ ...data, items: next });
              })}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: Math.round(16 * s),
                fontWeight: 600,
                color: theme.textOnLight,
                marginLeft: 16,
                width: Math.round(240 * s),
                flexShrink: 0,
                lineHeight: 1.3,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            />

            {/* Body */}
            <div
              {...richTextProps(item.body ?? '', !!onUpdate, (html) => {
                const next = [...data.items];
                next[i] = { ...next[i], body: html };
                onUpdate?.({ ...data, items: next });
              })}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: Math.round(14 * s),
                fontWeight: 400,
                color: theme.mutedOnLight,
                lineHeight: 1.5,
                flex: 1,
                marginLeft: 24,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
