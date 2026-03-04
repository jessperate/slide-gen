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
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* AirOps logo bottom-right */}
      <div style={{ position: 'absolute', bottom: 36, right: 64 }}>
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
          fontSize: 12,
          fontWeight: 500,
          color: '#008c44',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
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
          width: 480,
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
            lineHeight: 1.2,
            marginBottom: 24,
            letterSpacing: '-0.01em',
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
            borderRadius: 2,
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
            color: '#676c79',
            lineHeight: 1.6,
            marginBottom: 32,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
            borderRadius: 2,
          }}
        >
          {data.body}
        </div>

        {/* Attribution row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Photo placeholder */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#d4e8da',
              flexShrink: 0,
            }}
          />
          <div>
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.({ ...data, attribution: e.currentTarget.textContent ?? '' })}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 700,
                color: '#000d05',
                lineHeight: 1.3,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {data.attribution}
            </div>
          </div>
        </div>
      </div>

      {/* Right column — metric boxes */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 608,
          right: 64,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {data.metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #008c44',
              padding: 24,
              textAlign: 'center',
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
                fontSize: 13,
                fontWeight: 400,
                color: '#676c79',
                marginTop: 8,
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
