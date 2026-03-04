'use client';

import { CoverSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: CoverSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<CoverSlideData>) => void;
  theme?: SlideTheme;
}

export default function CoverSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: theme.darkBg,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* Background image */}
      {data.imageUrl && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              width: `${(data.imageZoom ?? 1) * 100}%`,
              height: `${(data.imageZoom ?? 1) * 100}%`,
              objectFit: 'cover',
              top: `${data.imageY ?? 50}%`,
              left: `${data.imageX ?? 50}%`,
              transform: 'translate(-50%, -50%)',
              cursor: interactive && onUpdate ? 'grab' : 'default',
              userSelect: 'none',
              opacity: 0.35,
            }}
            onMouseDown={interactive && onUpdate ? (e) => {
              e.preventDefault(); e.stopPropagation();
              const startX = e.clientX, startY = e.clientY;
              const ix = data.imageX ?? 50, iy = data.imageY ?? 50;
              const rect = e.currentTarget.parentElement!.getBoundingClientRect();
              const onMove = (me: MouseEvent) => onUpdate?.({ imageX: Math.max(0, Math.min(100, ix - (me.clientX - startX) / rect.width * 100)), imageY: Math.max(0, Math.min(100, iy - (me.clientY - startY) / rect.height * 100)) });
              const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
              window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
            } : undefined}
            onWheel={interactive && onUpdate ? (e) => { e.preventDefault(); onUpdate?.({ imageZoom: Math.max(1, Math.min(3, (data.imageZoom ?? 1) + (e.deltaY < 0 ? 0.1 : -0.1))) }); } : undefined}
          />
        </div>
      )}

      {/* Eyebrow */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, eyebrow: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme.textOnDark,
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
          color: theme.textOnDark,
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

      {/* AirOps logo */}
      {!data.hideLogo && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <AirOpsLogo color="rgba(255,255,255,0.5)" width={80} />
        </div>
      )}
    </div>
  );
}
