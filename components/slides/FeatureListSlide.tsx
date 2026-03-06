'use client';

import { FeatureListSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: FeatureListSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<FeatureListSlideData>) => void;
  theme?: SlideTheme;
}

export default function FeatureListSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  const items = data.items.slice(0, 5);

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
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              height: Math.round(96 * s),
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${theme.stroke}`,
              gap: 0,
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 28,
                color: theme.accentMid,
                width: 40,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {item.icon.startsWith('ri-') ? <i className={item.icon} /> : item.icon}
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
                width: Math.round(220 * s),
                flexShrink: 0,
                marginLeft: 16,
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
