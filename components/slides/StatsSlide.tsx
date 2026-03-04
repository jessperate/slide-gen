'use client';

import { StatsSlideData, METRIC_COLORS } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: StatsSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<StatsSlideData>) => void;
}

export default function StatsSlide({ data, interactive = true, onUpdate }: Props) {
  const metricsCount = data.metrics.length;
  const metricWidth = (1184 - (metricsCount - 1) * 16) / metricsCount;

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
      <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
        <AirOpsLogo color="#001408" width={80} />
      </div>

      {/* Green bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#00ff64' }} />

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
            color: '#000d05',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 32,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.headline}
        </div>

        {/* Thesis — green left-border accent, no box */}
        <div
          style={{
            borderLeft: '3px solid #008c44',
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
              color: '#3a4a3e',
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
          background: '#d4e8da',
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
              background: METRIC_COLORS[metric.color] || '#F5F5E8',
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
                color: '#000d05',
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
                color: '#676c79',
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
