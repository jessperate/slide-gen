'use client';

import { AgendaSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: AgendaSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<AgendaSlideData>) => void;
  theme?: SlideTheme;
}

export default function AgendaSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 480,
          height: 720,
          background: theme.agendaLeftBg,
          backgroundImage: `radial-gradient(circle, ${theme.agendaDotPattern} 2px, transparent 2px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '16px 16px',
        }}
      />

      {/* Right panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 480,
          width: 800,
          height: 720,
          background: theme.darkBg,
        }}
      />

      {/* AirOps logo bottom-left */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 1 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Title */}
      <div
        {...richTextProps(data.title ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, title: html }))}
        style={{
          position: 'absolute',
          top: 72,
          left: 528,
          fontFamily: '"Serrif VF", serif',
          fontSize: Math.round(56 * s),
          fontWeight: 400,
          color: theme.textOnDark,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      />

      {/* Items */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 528,
          right: 48,
        }}
      >
        {data.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              marginBottom: Math.round(40 * s),
            }}
          >
            <div
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: 18,
                fontWeight: 700,
                color: theme.accentMid,
                minWidth: 28,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div
              {...richTextProps(item ?? '', !!onUpdate, (html) => {
                const next = [...data.items];
                next[i] = html;
                onUpdate?.({ ...data, items: next });
              })}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: Math.round(18 * s),
                fontWeight: 400,
                color: theme.lightBg,
                lineHeight: 1.4,
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
