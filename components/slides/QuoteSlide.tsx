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

      {/* Green bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#00ff64' }} />

      {/* Giant decorative quote mark — background element */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: 48,
          fontFamily: '"Serrif VF", serif',
          fontSize: 360,
          fontWeight: 400,
          color: '#008c44',
          lineHeight: 1,
          opacity: 0.08,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        &ldquo;
      </div>

      {/* Quote text — vertically centered */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 120,
          right: 120,
          transform: 'translateY(-54%)',
        }}
      >
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, quote: e.currentTarget.textContent ?? '' })}
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 40,
            fontWeight: 400,
            color: '#000d05',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            marginBottom: 48,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.quote}
        </div>

        {/* Attribution row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Green hairline above attribution */}
          <div style={{ width: 32, height: 2, background: '#008c44' }} />
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ ...data, attribution: e.currentTarget.textContent ?? '' })}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: '#000d05',
              textAlign: 'center',
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          >
            {data.attribution}
          </div>
        </div>
      </div>
    </div>
  );
}
