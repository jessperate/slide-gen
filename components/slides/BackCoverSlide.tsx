'use client';

import { BackCoverSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: BackCoverSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<BackCoverSlideData>) => void;
}

export default function BackCoverSlide({ data, interactive = true, onUpdate }: Props) {
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
      {/* Green bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#00ff64' }} />

      {/* AirOps logo */}
      <div style={{ marginBottom: 32 }}>
        <AirOpsLogo color="#ffffff" width={220} />
      </div>

      {/* CTA */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, cta: e.currentTarget.textContent ?? '' })}
        style={{
          fontFamily: '"Saans", sans-serif',
          fontSize: 18,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          maxWidth: 640,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.cta}
      </div>

      {/* URL bottom-center */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, url: e.currentTarget.textContent ?? '' })}
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
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.url}
      </div>
    </div>
  );
}
