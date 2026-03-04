'use client';

import { HeroSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: HeroSlideData;
  interactive?: boolean;
}

export default function HeroSlide({ data, interactive = true }: Props) {
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
        backgroundImage: 'radial-gradient(circle, rgba(0,255,100,0.12) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* AirOps logo top-center */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <AirOpsLogo color="#ffffff" width={120} />
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 80,
          right: 80,
          transform: 'translateY(-55%)',
          fontFamily: '"Saans", sans-serif',
          fontSize: 96,
          fontWeight: 700,
          color: '#00ff64',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          whiteSpace: 'pre-line',
        }}
      >
        {data.headline}
      </div>

      {/* Customer logos row */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          alignItems: 'center',
        }}
      >
        {data.customerLogos.map((logo, i) => (
          <div
            key={i}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              color: '#ffffff',
              opacity: 0.7,
              letterSpacing: '0.02em',
            }}
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
