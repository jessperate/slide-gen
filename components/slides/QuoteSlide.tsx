'use client';

import { QuoteSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: QuoteSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<QuoteSlideData>) => void;
  theme?: SlideTheme;
}

export default function QuoteSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: theme.lightBg,
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
              opacity: 0.2,
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

      {/* AirOps logo bottom-left */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent }} />

      {/* Giant decorative quote mark */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: 48,
          fontFamily: '"Serrif VF", serif',
          fontSize: 360,
          fontWeight: 400,
          color: theme.accentMid,
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
            color: theme.textOnLight,
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
          <div style={{ width: 32, height: 2, background: theme.accentMid }} />
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ ...data, attribution: e.currentTarget.textContent ?? '' })}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: theme.textOnLight,
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
