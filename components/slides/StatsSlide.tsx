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
  const totalWidth = 1232 - 48; // 1184px
  const metricWidth = (totalWidth - (metricsCount - 1) * 16) / metricsCount;

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
      {/* AirOps logo bottom-right */}
      <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
        <AirOpsLogo color="#001408" width={80} />
      </div>

      {/* Green bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#00ff64' }} />

      {/* Headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          fontFamily: '"Serrif VF", serif',
          fontSize: 44,
          fontWeight: 400,
          color: '#000d05',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.headline}
      </div>

      {/* Thesis box */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, thesis: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 140,
          left: 48,
          width: 560,
          background: 'white',
          border: '1px solid #d4e8da',
          padding: 24,
          fontFamily: '"Saans", sans-serif',
          fontSize: 15,
          fontWeight: 700,
          color: '#000d05',
          lineHeight: 1.5,
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.thesis}
      </div>

      {/* Arrow from thesis to metrics */}
      <svg
        style={{
          position: 'absolute',
          top: 140,
          left: 48,
          width: 560,
          height: 200,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
        viewBox="0 0 560 200"
      >
        <line
          x1="280"
          y1="200"
          x2="280"
          y2="220"
          stroke="#2D8859"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#2D8859" />
          </marker>
        </defs>
      </svg>

      {/* Metrics row */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 48,
          right: 48,
          height: 280,
          display: 'flex',
          gap: 16,
        }}
      >
        {data.metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              width: metricWidth,
              height: 280,
              background: METRIC_COLORS[metric.color] || '#F5F5E8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              gap: 12,
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
                fontSize: 52,
                fontWeight: 400,
                color: '#000d05',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
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
                textAlign: 'center',
                lineHeight: 1.4,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
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
