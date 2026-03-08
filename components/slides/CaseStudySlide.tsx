'use client';

import { CaseStudySlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: CaseStudySlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<CaseStudySlideData>) => void;
  theme?: SlideTheme;
}

function logoSrc(src: string): string {
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  return `https://cdn.brandfetch.io/${src}/w/400/h/120`;
}

export default function CaseStudySlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const s = data.textScale ?? 1;

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
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* Customer logo — top left */}
      <div style={{ position: 'absolute', top: 40, left: 64, height: 60, display: 'flex', alignItems: 'center' }}>
        {data.logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc(data.logoSrc)} alt="" style={{ maxHeight: 52, maxWidth: 220, objectFit: 'contain', display: 'block' }} />
        ) : (
          <div style={{ height: 44, width: 160, background: theme.stroke, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: '"Saans Mono", monospace', fontSize: 9, color: theme.mutedOnLight, letterSpacing: '0.08em' }}>COMPANY LOGO</span>
          </div>
        )}
      </div>

      {/* Category — top right */}
      <div
        {...richTextProps(data.category ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, category: html }))}
        style={{
          position: 'absolute',
          top: 52,
          right: 64,
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme.mutedOnLight,
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
        }}
      />

      {/* Vertical divider */}
      <div style={{ position: 'absolute', top: 32, bottom: 72, left: 592, width: 1, background: theme.stroke }} />

      {/* Left column */}
      <div
        style={{
          position: 'absolute',
          top: 116,
          left: 64,
          width: 504,
          bottom: 84,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: Math.round(36 * s),
            fontWeight: 400,
            color: theme.textOnLight,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 24,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        />
        {data.stats.map((stat, i) => (
          <div
            key={i}
            style={{
              borderTop: `1px solid ${theme.stroke}`,
              paddingTop: 14,
              paddingBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              {...richTextProps(stat.value ?? '', !!onUpdate, (html) => {
                const next = [...data.stats];
                next[i] = { ...next[i], value: html };
                onUpdate?.({ ...data, stats: next });
              })}
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: Math.round(54 * s),
                fontWeight: 400,
                color: theme.textOnLight,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                flexShrink: 0,
                width: 120,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />
            <div
              {...richTextProps(stat.description ?? '', !!onUpdate, (html) => {
                const next = [...data.stats];
                next[i] = { ...next[i], description: html };
                onUpdate?.({ ...data, stats: next });
              })}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: Math.round(14 * s),
                color: theme.bodyOnLight,
                lineHeight: 1.45,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />
          </div>
        ))}
      </div>

      {/* Right column */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 608,
          right: 64,
          bottom: 72,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Screenshot / image — always bordered so the bounding box stays visible */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          border: `1px solid ${theme.stroke}`,
          display: 'flex',
          alignItems: 'stretch',
        }}>
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.imageUrl}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', display: 'block' }}
            />
          ) : (
            <div
              style={{
                flex: 1,
                background: theme.stroke,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 13, color: theme.mutedOnLight }}>
                Add a screenshot or image
              </span>
            </div>
          )}
        </div>

        {/* Quote */}
        {(data.quote !== undefined || data.quoteAttribution !== undefined) && (
          <div style={{ flexShrink: 0, paddingTop: 18, paddingBottom: 4 }}>
            <div
              {...richTextProps(data.quote ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, quote: html }))}
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: Math.round(15 * s),
                color: theme.textOnLight,
                lineHeight: 1.55,
                marginBottom: 6,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />
            <div
              {...richTextProps(data.quoteAttribution ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, quoteAttribution: html }))}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: Math.round(12 * s),
                fontWeight: 600,
                color: theme.mutedOnLight,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
