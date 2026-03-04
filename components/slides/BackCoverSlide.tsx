'use client';

import { BackCoverSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: BackCoverSlideData;
  interactive?: boolean;
}

export default function BackCoverSlide({ data, interactive = true }: Props) {
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* AirOps logo */}
      <div style={{ marginBottom: 32 }}>
        <AirOpsLogo color="#ffffff" width={220} />
      </div>

      {/* CTA */}
      <div
        style={{
          fontFamily: '"Saans", sans-serif',
          fontSize: 18,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          maxWidth: 640,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
        }}
      >
        {data.cta}
      </div>

      {/* URL bottom-center */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Saans Mono", monospace',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'lowercase',
        }}
      >
        {data.url}
      </div>
    </div>
  );
}
