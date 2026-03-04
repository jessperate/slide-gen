'use client';

import { ChecklistSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ChecklistSlideData;
  interactive?: boolean;
}

export default function ChecklistSlide({ data, interactive = true }: Props) {
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

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 64,
          fontFamily: '"Saans", sans-serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#000d05',
        }}
      >
        {data.headline}
      </div>

      {/* Items */}
      <div
        style={{
          position: 'absolute',
          top: 128,
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
              borderBottom: '1px solid #e5e5e5',
              gap: 0,
            }}
          >
            {/* Checkbox */}
            <div
              style={{
                width: 24,
                height: 24,
                border: '2px solid #008c44',
                background: item.checked ? '#008c44' : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              {item.checked ? '✓' : ''}
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#000d05',
                marginLeft: 16,
                width: 240,
                flexShrink: 0,
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </div>

            {/* Body */}
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 400,
                color: '#676c79',
                lineHeight: 1.5,
                flex: 1,
                marginLeft: 24,
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
