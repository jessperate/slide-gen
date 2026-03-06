'use client';

import { BackCoverSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: BackCoverSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<BackCoverSlideData>) => void;
  theme?: SlideTheme;
}

export default function BackCoverSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent }} />

      {/* AirOps logo */}
      {!data.hideLogo && (
        <div style={{ marginBottom: 32 }}>
          <AirOpsLogo color={theme.logoOnDark} width={220} />
        </div>
      )}

      {/* CTA */}
      <div
        {...richTextProps(data.cta ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, cta: html }))}
        style={{
          fontFamily: '"Saans", sans-serif',
          fontSize: 18,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          maxWidth: 640,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      />

      {/* URL bottom-center */}
      <div
        {...richTextProps(data.url ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, url: html }))}
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Saans Mono", monospace',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'lowercase',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      />
    </div>
  );
}
