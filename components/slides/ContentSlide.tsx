'use client';

import { ContentSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ContentSlideData;
  interactive?: boolean;
}

export default function ContentSlide({ data, interactive = true }: Props) {
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

      {/* Headline */}
      <div
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
        }}
      >
        {data.headline}
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 48,
          right: 48,
          height: 1,
          background: '#d4e8da',
        }}
      />

      {/* Columns */}
      <div
        style={{
          position: 'absolute',
          top: 152,
          left: 48,
          right: 48,
          bottom: 80,
          display: 'flex',
          gap: 24,
        }}
      >
        {data.columns.map((col, i) => (
          <div
            key={i}
            style={{
              width: 556,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 18,
                fontWeight: 500,
                color: '#000d05',
                marginBottom: 16,
                lineHeight: 1.3,
              }}
            >
              {col.heading}
            </div>
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 400,
                color: '#676c79',
                lineHeight: 1.6,
              }}
            >
              {col.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
