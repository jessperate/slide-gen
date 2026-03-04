'use client';

import { DiagramSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: DiagramSlideData;
  interactive?: boolean;
}

export default function DiagramSlide({ data, interactive = true }: Props) {
  const colCount = data.columns.length;
  const totalWidth = 1232 - 48; // 1184px
  const colWidth = totalWidth / colCount;

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

      {/* Columns */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: 48,
          right: 48,
          bottom: 80,
          display: 'flex',
        }}
      >
        {data.columns.map((col, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '32px 24px',
              borderLeft: i === 0 ? 'none' : '1px solid #d4e8da',
              borderRight: i === data.columns.length - 1 ? 'none' : undefined,
            }}
          >
            {/* Column header */}
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: '#676c79',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {col.header}
            </div>

            {/* Column body */}
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 400,
                color: '#000d05',
                lineHeight: 1.5,
                textAlign: 'center',
                maxWidth: colWidth - 48,
              }}
            >
              {col.body}
            </div>

            {/* Tag */}
            {col.tag && (
              <div
                style={{
                  marginTop: 24,
                  fontFamily: '"Saans Mono", monospace',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#008c44',
                  background: '#EEF5F1',
                  border: '1px solid #d4e8da',
                  padding: '4px 10px',
                  borderRadius: 0,
                }}
              >
                {col.tag}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Horizontal divider between headline and columns */}
      <div
        style={{
          position: 'absolute',
          top: 148,
          left: 48,
          right: 48,
          height: 1,
          background: '#d4e8da',
        }}
      />
    </div>
  );
}
