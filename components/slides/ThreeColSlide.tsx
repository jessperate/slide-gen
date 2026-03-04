'use client';

import { ThreeColSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ThreeColSlideData;
  interactive?: boolean;
}

export default function ThreeColSlide({ data, interactive = true }: Props) {
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

      {/* Page headline */}
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

      {/* Full-width horizontal rule */}
      <div
        style={{
          position: 'absolute',
          top: 108,
          left: 64,
          right: 64,
          height: 1,
          background: '#d4e8da',
        }}
      />

      {/* Columns container */}
      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 64,
          right: 64,
          bottom: 80,
          display: 'flex',
          flexDirection: 'row',
          gap: 0,
        }}
      >
        {data.columns.map((col, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              paddingTop: 24,
              paddingRight: i < data.columns.length - 1 ? 32 : 0,
              paddingLeft: i > 0 ? 32 : 0,
              borderLeft: i > 0 ? '1px solid #d4e8da' : 'none',
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 32,
                color: '#008c44',
                marginBottom: 8,
                lineHeight: 1,
              }}
            >
              {col.icon}
            </div>

            {/* Column header */}
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 18,
                fontWeight: 500,
                color: '#000d05',
                marginBottom: 8,
                lineHeight: 1.3,
              }}
            >
              {col.header}
            </div>

            {/* Rule below header */}
            <div
              style={{
                width: '100%',
                height: 1,
                background: '#d4e8da',
                marginBottom: 16,
              }}
            />

            {/* Body */}
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
