'use client';

import { CoverSlideData } from '@/lib/slides';

interface Props {
  data: CoverSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<CoverSlideData>) => void;
}

export default function CoverSlide({ data, interactive = true, onUpdate }: Props) {
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
      {/* Eyebrow */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, eyebrow: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'white',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.eyebrow}
      </div>

      {/* Vertical hairline rule */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1,
          height: 80,
          background: 'rgba(255,255,255,0.15)',
        }}
      />

      {/* Headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          fontFamily: '"Serrif VF", serif',
          fontSize: 64,
          fontWeight: 400,
          color: 'white',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          whiteSpace: 'pre-line',
          padding: '0 120px',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.headline}
      </div>

      {/* Subheadline */}
      {data.subheadline !== undefined && (
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, subheadline: e.currentTarget.textContent ?? '' })}
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: '"Saans", sans-serif',
            fontSize: 14,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.5)',
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
            borderRadius: 2,
          }}
        >
          {data.subheadline}
        </div>
      )}

      {/* "with AirOps" attribution */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Saans", sans-serif',
          fontSize: 14,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        with AirOps
      </div>
    </div>
  );
}
