'use client';

import { HeroSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: HeroSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<HeroSlideData>) => void;
  theme?: SlideTheme;
}

export default function HeroSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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
        backgroundImage: `radial-gradient(circle, ${theme.heroDotPattern} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* AirOps logo top-center */}
      {!data.hideLogo && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <AirOpsLogo color={theme.logoOnDark} width={120} />
        </div>
      )}

      {/* Headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: '50%',
          left: 80,
          right: 80,
          transform: 'translateY(-55%)',
          fontFamily: '"Serrif VF", serif',
          fontSize: 96,
          fontWeight: 400,
          color: theme.accent,
          textAlign: 'center',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          whiteSpace: 'pre-line',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
        }}
      >
        {data.headline}
      </div>

      {/* Trusted by label */}
      <div
        style={{
          position: 'absolute',
          bottom: 176,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Saans Mono", monospace',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        Trusted by
      </div>

      {/* Customer logos row */}
      <div
        style={{
          position: 'absolute',
          bottom: 96,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {data.customerLogos.map((domain, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <img
              src={`https://cdn.brandfetch.io/${domain}/w/200/h/60`}
              alt={domain}
              style={{
                height: 28,
                width: 'auto',
                maxWidth: 120,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.65,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {onUpdate && (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const next = [...data.customerLogos];
                  next[i] = e.currentTarget.textContent ?? '';
                  onUpdate?.({ ...data, customerLogos: next });
                }}
                style={{
                  fontFamily: '"Saans Mono", monospace',
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.06em',
                  outline: 'none',
                  cursor: 'text',
                  textAlign: 'center',
                }}
              >
                {domain}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
