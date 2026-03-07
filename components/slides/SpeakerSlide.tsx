'use client';

import { SpeakerSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: SpeakerSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<SpeakerSlideData>) => void;
  theme?: SlideTheme;
}

function logoSrc(src: string): string {
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  return `https://cdn.brandfetch.io/${src}/w/400/h/120`;
}

export default function SpeakerSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;
  const hasHeadshot = !!data.headshotUrl;

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
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* Left column */}
      <div
        style={{
          width: 548,
          flexShrink: 0,
          padding: '56px 56px 80px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Name + role */}
        <div>
          <div
            {...richTextProps(data.name ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, name: html }))}
            style={{
              fontFamily: '"Serrif VF", serif',
              fontSize: Math.round(80 * s),
              fontWeight: 400,
              color: theme.textOnLight,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              marginBottom: 20,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          />
          {data.role !== undefined && (
            <div
              {...richTextProps(data.role ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, role: html }))}
              style={{
                fontFamily: '"Saans Mono", monospace',
                fontSize: Math.round(13 * s),
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: theme.accentMid,
                background: `${theme.accentMid}18`,
                display: 'inline-block',
                padding: '4px 10px',
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />
          )}
        </div>

        {/* Quote */}
        <div>
          <div style={{ width: 32, height: 3, background: theme.accentMid, marginBottom: 20 }} />
          <div
            {...richTextProps(data.quote ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, quote: html }))}
            style={{
              fontFamily: '"Serrif VF", serif',
              fontSize: Math.round(28 * s),
              fontWeight: 400,
              color: theme.textOnLight,
              letterSpacing: '-0.01em',
              lineHeight: 1.35,
              outline: 'none',
              cursor: onUpdate ? 'text' : 'default',
            }}
          />
        </div>
      </div>

      {/* Vertical divider */}
      <div style={{ width: 1, background: theme.stroke, flexShrink: 0, margin: '32px 0 72px' }} />

      {/* Right column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Headshot */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {hasHeadshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.headshotUrl}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${data.headshotX ?? 50}% ${data.headshotY ?? 20}%`,
                transform: `scale(${data.headshotZoom ?? 1})`,
                transformOrigin: `${data.headshotX ?? 50}% ${data.headshotY ?? 20}%`,
                cursor: interactive && onUpdate ? 'grab' : 'default',
                userSelect: 'none',
              }}
              onMouseDown={interactive && onUpdate ? (e) => {
                e.preventDefault(); e.stopPropagation();
                const startX = e.clientX, startY = e.clientY;
                const ix = data.headshotX ?? 50, iy = data.headshotY ?? 20;
                const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                const onMove = (me: MouseEvent) => onUpdate?.({ headshotX: Math.max(0, Math.min(100, ix - (me.clientX - startX) / rect.width * 100)), headshotY: Math.max(0, Math.min(100, iy - (me.clientY - startY) / rect.height * 100)) });
                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
              } : undefined}
              onWheel={interactive && onUpdate ? (e) => { e.preventDefault(); onUpdate?.({ headshotZoom: Math.max(1, Math.min(3, (data.headshotZoom ?? 1) + (e.deltaY < 0 ? 0.1 : -0.1))) }); } : undefined}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: theme.stroke,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 40, opacity: 0.3 }}>👤</div>
              <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 12, color: theme.mutedOnLight }}>
                Upload a headshot
              </span>
            </div>
          )}
        </div>

        {/* Company logo strip */}
        <div
          style={{
            flexShrink: 0,
            height: 96,
            borderTop: `1px solid ${theme.stroke}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 6,
          }}
        >
          {data.companyLogoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc(data.companyLogoSrc)}
              alt=""
              style={{ maxHeight: 48, maxWidth: 220, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <div style={{ height: 36, width: 140, background: theme.stroke, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: '"Saans Mono", monospace', fontSize: 9, color: theme.mutedOnLight, letterSpacing: '0.08em' }}>COMPANY LOGO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
