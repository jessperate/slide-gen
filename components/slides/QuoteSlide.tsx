'use client';

import { QuoteSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: QuoteSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<QuoteSlideData>) => void;
}

export default function QuoteSlide({ data, interactive = true, onUpdate }: Props) {
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

      {/* Quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 80,
          fontFamily: '"Serrif VF", serif',
          fontSize: 120,
          fontWeight: 400,
          color: '#000d05',
          lineHeight: 0.8,
          userSelect: 'none',
        }}
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, quote: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 180,
          left: 80,
          right: 80,
          fontFamily: '"Serrif VF", serif',
          fontSize: 36,
          fontWeight: 400,
          color: '#000d05',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.quote}
      </div>

      {/* Attribution */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, attribution: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 560,
          left: 80,
          fontFamily: '"Saans", sans-serif',
          fontSize: 16,
          fontWeight: 700,
          color: '#000d05',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.attribution}
      </div>
    </div>
  );
}
