'use client';

import { CTASection as CTAData } from '@/lib/webgen';

interface Props {
  data: CTAData;
  onChange: (updated: CTAData) => void;
}

export default function CTASection({ data, onChange }: Props) {
  const update = (fields: Partial<CTAData>) => onChange({ ...data, ...fields });

  const isDark = data.variant === 'dark';
  const bg = isDark ? '#002910' : '#1b1b8f';
  const pillBg = isDark ? '#000d05' : '#0f0f57';
  const pillBorder = isDark ? '#c0ffd2' : '#d0d0ff';
  const pillColor = isDark ? '#c0ffd2' : '#d0d0ff';

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 120px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {data.eyebrow !== undefined && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ eyebrow: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Saans Mono", "DM Mono", monospace',
            fontSize: 14, fontWeight: 500,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.84px', color: pillColor,
            padding: '8px 16px', border: `1px solid ${pillBorder}`,
            borderRadius: 5, background: pillBg,
            marginBottom: 32, display: 'inline-flex',
            width: 'fit-content', lineHeight: 1.3,
          }}
        >
          {data.eyebrow}
        </div>
      )}

      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => update({ headline: e.currentTarget.textContent || '' })}
        style={{
          fontFamily: '"Serrif VF", Georgia, serif',
          fontSize: 56, fontWeight: 400, lineHeight: 1.1,
          letterSpacing: '-1.68px', color: '#f8fffa',
          marginBottom: 20, maxWidth: 800,
        }}
      >
        {data.headline}
      </div>

      {data.body && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ body: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Saans", sans-serif',
            fontSize: 18, lineHeight: 1.5,
            color: 'rgba(248,255,250,0.6)',
            marginBottom: 36, maxWidth: 560,
          }}
        >
          {data.body}
        </div>
      )}

      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => update({ ctaLabel: e.currentTarget.textContent || '' })}
        style={{
          fontFamily: '"Saans", sans-serif',
          fontSize: 20, fontWeight: 500,
          color: '#002910', background: '#00ff64',
          padding: '16px 32px', borderRadius: 58,
          cursor: 'text', border: 'none',
          display: 'inline-block',
        }}
      >
        {data.ctaLabel}
      </div>
    </div>
  );
}
