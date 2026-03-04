'use client';

import { CustomerStorySlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: CustomerStorySlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<CustomerStorySlideData>) => void;
}

export default function CustomerStorySlide({ data, interactive = true, onUpdate }: Props) {
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

      {/* Customer label */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, customerName: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 48,
          left: 64,
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          fontWeight: 500,
          color: '#008c44',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
        }}
      >
        {data.customerName}
      </div>

      {/* Left column */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 64,
          width: 528,
          bottom: 96,
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
            fontSize: 36,
            fontWeight: 400,
            color: '#000d05',
            lineHeight: 1.25,
            marginBottom: 24,
            letterSpacing: '-0.01em',
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.headline}
        </div>

        {/* Body */}
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, body: e.currentTarget.textContent ?? '' })}
          style={{
            fontFamily: '"Saans", sans-serif',
            fontSize: 14,
            fontWeight: 400,
            color: '#3a4a3e',
            lineHeight: 1.65,
            marginBottom: 32,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.body}
        </div>

        {/* Attribution row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: '#d4e8da',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              color: '#008c44',
              fontWeight: 700,
            }}
          >
            {(data.attribution[0] || '?').toUpperCase()}
          </div>
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ ...data, attribution: e.currentTarget.textContent ?? '' })}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#000d05',
              lineHeight: 1.3,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          >
            {data.attribution}
          </div>
        </div>
      </div>

      {/* Vertical separator */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          bottom: 64,
          left: 640,
          width: 1,
          background: '#d4e8da',
        }}
      />

      {/* Right column — metric boxes */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 672,
          right: 64,
          bottom: 96,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          justifyContent: 'center',
        }}
      >
        {data.metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              border: '1px solid #d4e8da',
              borderLeft: '3px solid #008c44',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
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
                fontSize: 48,
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
                fontSize: 13,
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
