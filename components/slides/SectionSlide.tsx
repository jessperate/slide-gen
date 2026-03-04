'use client';

import { SectionSlideData } from '@/lib/slides';

interface Props {
  data: SectionSlideData;
  interactive?: boolean;
}

export default function SectionSlide({ data, interactive = true }: Props) {
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#002910',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* Number + Label top-left */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <span>{data.number}</span>
        <span
          style={{
            width: 1,
            height: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'inline-block',
          }}
        />
        <span>{data.label}</span>
      </div>

      {/* Left accent bar + headline row */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 48,
          right: 48,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            width: 3,
            height: 48,
            background: '#008c44',
            flexShrink: 0,
          }}
        />

        {/* Headline */}
        <div
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 56,
            fontWeight: 400,
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            whiteSpace: 'pre-line',
            maxWidth: 700,
          }}
        >
          {data.headline}
        </div>
      </div>
    </div>
  );
}
