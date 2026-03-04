'use client';

import { StatsSlideData, METRIC_COLORS } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: StatsSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<StatsSlideData>) => void;
  theme?: SlideTheme;
}

export default function StatsSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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

      {/* Left column: headline + thesis */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 64,
          width: 480,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Headline */}
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
            marginBottom: 32,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.headline}
        </div>

        {/* Thesis */}
        <div
          style={{
            borderLeft: `3px solid ${theme.accentMid}`,
            paddingLeft: 20,
          }}
        >
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ ...data, thesis: e.currentTarget.textContent ?? '' })}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 15,
              fontWeight: 400,
              color: theme.bodyOnLight,
              lineHeight: 1.6,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          >
            {data.thesis}
          </div>
        </div>
      </div>

      {/* Vertical separator */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          bottom: 80,
          left: 592,
          width: 1,
          background: theme.stroke,
        }}
      />

      {/* Right column: metric cards */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 624,
          right: 64,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        {data.metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              background: theme.id === 'green' ? (METRIC_COLORS[metric.color] || '#F5F5E8') : '#ffffff',
              border: theme.id === 'green' ? 'none' : `1px solid ${theme.stroke}`,
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'baseline',
              gap: 20,
            }}
          >
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.metrics];
                next[i] = { ...next[i], value: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, metrics: next });
              }}
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: 56,
                fontWeight: 400,
                color: theme.textOnLight,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                flexShrink: 0,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {metric.value}
            </div>
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.metrics];
                next[i] = { ...next[i], label: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, metrics: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 400,
                color: theme.mutedOnLight,
                lineHeight: 1.4,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
