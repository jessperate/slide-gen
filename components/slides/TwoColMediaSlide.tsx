'use client';

import { TwoColMediaSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: TwoColMediaSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<TwoColMediaSlideData>) => void;
  theme?: SlideTheme;
}

export default function TwoColMediaSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const hasImage = !!data.imageUrl;

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
        display: 'flex',
      }}
    >
      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* AirOps logo */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Left — text content */}
      <div
        style={{
          flex: '0 0 560px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 72px',
        }}
      >
        {/* Eyebrow */}
        {data.eyebrow !== undefined && (
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate?.({ ...data, eyebrow: e.currentTarget.textContent ?? '' })}
            style={{
              fontFamily: '"Saans Mono", monospace',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: theme.accentMid,
              marginBottom: 20,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          >
            {data.eyebrow}
          </div>
        )}

        {/* Headline */}
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 48,
            fontWeight: 400,
            color: theme.textOnLight,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 28,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.headline}
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 2, background: theme.accent, marginBottom: 24 }} />

        {/* Body */}
        <div
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, body: e.currentTarget.textContent ?? '' })}
          style={{
            fontFamily: '"Saans", sans-serif',
            fontSize: 17,
            fontWeight: 400,
            color: theme.bodyOnLight,
            lineHeight: 1.7,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        >
          {data.body}
        </div>
      </div>

      {/* Right — image or colored panel */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: hasImage ? 'transparent' : theme.darkBg,
        }}
      >
        {hasImage ? (
          <>
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
          </>
        ) : (
          /* Decorative pattern when no image */
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Dot grid pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(${theme.accent}22 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
            {/* Center accent mark */}
            <div
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: 180,
                fontWeight: 400,
                color: theme.accent,
                opacity: 0.15,
                userSelect: 'none',
                pointerEvents: 'none',
                lineHeight: 1,
              }}
            >
              ✦
            </div>
          </div>
        )}

        {/* Left edge gradient blending */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to right, ${hasImage ? theme.lightBg : theme.darkBg} 0%, transparent 8%)`,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
