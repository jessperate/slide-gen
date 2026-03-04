'use client';

import { BigQuoteSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: BigQuoteSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<BigQuoteSlideData>) => void;
  theme?: SlideTheme;
}

export default function BigQuoteSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const hasImage = !!data.imageUrl;

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
        display: 'flex',
      }}
    >
      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* AirOps logo */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 64, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnDark} width={80} />
        </div>
      )}

      {/* Left content area */}
      <div
        style={{
          flex: hasImage ? '0 0 680px' : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 80px 80px 80px',
        }}
      >
        {/* Giant quote mark */}
        <div
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 200,
            fontWeight: 400,
            color: theme.accent,
            lineHeight: 0.7,
            marginBottom: 16,
            opacity: 0.3,
            userSelect: 'none',
            pointerEvents: 'none',
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
            fontFamily: '"Serrif VF", serif',
            fontSize: hasImage ? 36 : 48,
            fontWeight: 400,
            color: theme.textOnDark,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            marginBottom: 40,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.quote}
        </div>

        {/* Rule */}
        <div style={{ width: 40, height: 2, background: theme.accent, marginBottom: 20 }} />

        {/* Attribution */}
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, attribution: e.currentTarget.textContent ?? '' })}
          style={{
            fontFamily: '"Saans", sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: theme.textOnDark,
            marginBottom: 6,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.attribution}
        </div>

        {data.role !== undefined && (
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ ...data, role: e.currentTarget.textContent ?? '' })}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          >
            {data.role}
          </div>
        )}
      </div>

      {/* Right image area */}
      {hasImage && (
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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
              filter: 'grayscale(20%)',
              cursor: interactive && onUpdate ? 'grab' : 'default',
              userSelect: 'none',
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
          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${theme.darkBg} 0%, transparent 30%)`,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
