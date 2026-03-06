'use client';

import { SectionSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: SectionSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<SectionSlideData>) => void;
  theme?: SlideTheme;
}

export default function SectionSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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
      {/* Number + Label top-left */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme.mutedOnDark,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <span
          {...richTextProps(data.number ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, number: html }))}
          style={{
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
            borderRadius: 2,
          }}
        />
        <span
          style={{
            width: 1,
            height: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'inline-block',
          }}
        />
        <span
          {...richTextProps(data.label ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, label: html }))}
          style={{
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
            borderRadius: 2,
          }}
        />
      </div>

      {/* AirOps logo bottom-left */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
          <AirOpsLogo color={theme.mutedOnDark} width={80} />
        </div>
      )}

      {/* Left accent bar + headline row */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 48,
          right: 48,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            width: 3,
            height: 48,
            background: theme.accentMid,
            flexShrink: 0,
          }}
        />

        {/* Headline */}
        <div
          {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 56,
            fontWeight: 400,
            color: theme.textOnDark,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            whiteSpace: 'pre-line',
            maxWidth: 700,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}
