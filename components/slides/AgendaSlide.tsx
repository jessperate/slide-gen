'use client';

import { AgendaSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';

interface Props {
  data: AgendaSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<AgendaSlideData>) => void;
  theme?: SlideTheme;
}

export default function AgendaSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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

      {/* Title */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, title: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 72,
          left: 528,
          fontFamily: '"Serrif VF", serif',
          fontSize: 56,
          fontWeight: 400,
          color: theme.textOnDark,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.title}
      </div>

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
              marginBottom: 40,
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
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.items];
                next[i] = e.currentTarget.textContent ?? '';
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 18,
                fontWeight: 400,
                color: theme.lightBg,
                lineHeight: 1.4,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
