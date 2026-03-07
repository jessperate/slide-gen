'use client';

import { FullImageSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: FullImageSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<FullImageSlideData>) => void;
  theme?: SlideTheme;
}

export default function FullImageSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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
      }}
    >
      {/* Full-bleed image */}
      {hasImage ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `${data.imageX ?? 50}% ${data.imageY ?? 50}%`,
              transform: `scale(${data.imageZoom ?? 1})`,
              transformOrigin: `${data.imageX ?? 50}% ${data.imageY ?? 50}%`,
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
        </div>
      ) : (
        /* Placeholder when no image */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              backgroundImage: `radial-gradient(${theme.accent}22 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              position: 'absolute',
              inset: 0,
            }}
          />
          <div style={{ fontSize: 48, opacity: 0.2, userSelect: 'none' }}>🖼</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', userSelect: 'none' }}>
            Add an image in the Edit panel
          </div>
        </div>
      )}

      {/* Caption — bottom overlay */}
      {data.caption !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '32px 48px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
          }}
        >
          <div
            {...richTextProps(data.caption ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, caption: html }))}
            style={{
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.5,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          />
        </div>
      )}
    </div>
  );
}
