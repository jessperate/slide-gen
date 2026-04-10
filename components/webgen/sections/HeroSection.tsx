'use client';

import { HeroSection as HeroData } from '@/lib/webgen';

interface Props {
  data: HeroData;
  onChange: (updated: HeroData) => void;
}

export default function HeroSection({ data, onChange }: Props) {
  const update = (fields: Partial<HeroData>) => onChange({ ...data, ...fields });

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#ffffff',
        backgroundImage: 'radial-gradient(#d4e8da 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Eyebrow */}
      {data.eyebrow !== undefined && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ eyebrow: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Saans Mono", "DM Mono", monospace',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.84px',
            color: '#008c44',
            padding: '8px 16px',
            border: '1px solid #057a28',
            borderRadius: 5,
            background: '#eef9f3',
            marginBottom: 32,
            display: 'inline-flex',
            width: 'fit-content',
            lineHeight: 1.3,
          }}
        >
          {data.eyebrow}
        </div>
      )}

      {/* H2 Composition */}
      <div style={{ marginBottom: 24 }}>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ headlineSerif: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Serrif VF", Georgia, serif',
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-2.16px',
            color: '#002910',
          }}
        >
          {data.headlineSerif}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ headlineSans: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Saans", "Inter", sans-serif',
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: '-1.44px',
            color: '#002910',
          }}
        >
          {data.headlineSans}
        </div>
      </div>

      {/* Body */}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => update({ body: e.currentTarget.textContent || '' })}
        style={{
          fontFamily: '"Saans", "Inter", sans-serif',
          fontSize: 20,
          lineHeight: 1.5,
          color: '#01200d',
          maxWidth: 640,
          marginBottom: 32,
        }}
      >
        {data.body}
      </div>

      {/* CTA */}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => update({ ctaLabel: e.currentTarget.textContent || '' })}
        style={{
          fontFamily: '"Saans", "Inter", sans-serif',
          fontSize: 20,
          fontWeight: 500,
          color: '#002910',
          background: '#00ff64',
          padding: '16px 32px',
          borderRadius: 58,
          cursor: 'text',
          border: 'none',
          display: 'inline-block',
        }}
      >
        {data.ctaLabel}
      </div>
    </div>
  );
}
