'use client';

import { FeaturesSection as FeaturesData, FeatureCard } from '@/lib/webgen';

interface Props {
  data: FeaturesData;
  onChange: (updated: FeaturesData) => void;
}

const CARD_COLORS: Record<string, { bg: string; text: string }> = {
  pink:   { bg: '#fee7fd', text: '#3a092c' },
  red:    { bg: '#ffe2e2', text: '#331010' },
  yellow: { bg: '#f9ffd4', text: '#242603' },
  indigo: { bg: '#eaeaff', text: '#0f0f57' },
};

export default function FeaturesSection({ data, onChange }: Props) {
  const update = (fields: Partial<FeaturesData>) => onChange({ ...data, ...fields });
  const updateCard = (idx: number, fields: Partial<FeatureCard>) => {
    const cards = data.cards.map((c, i) => (i === idx ? { ...c, ...fields } : c));
    update({ cards });
  };

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#ffffff',
        backgroundImage: 'radial-gradient(#d4e8da 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        padding: '56px 64px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {data.eyebrow !== undefined && (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update({ eyebrow: e.currentTarget.textContent || '' })}
              style={{
                fontFamily: '"Saans Mono", "DM Mono", monospace',
                fontSize: 13, fontWeight: 500,
                textTransform: 'uppercase' as const, letterSpacing: '0.84px',
                color: '#008c44', padding: '6px 14px',
                border: '1px solid #057a28', borderRadius: 5,
                background: '#eef9f3', marginBottom: 20,
                display: 'inline-flex', width: 'fit-content', lineHeight: 1.3,
              }}
            >
              {data.eyebrow}
            </div>
          )}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ headlineSerif: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Serrif VF", Georgia, serif',
              fontSize: 44, fontWeight: 400, lineHeight: 1.1,
              letterSpacing: '-1.32px', color: '#002910',
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
              fontSize: 44, fontWeight: 400, lineHeight: 1.0,
              letterSpacing: '-1.32px', color: '#002910',
            }}
          >
            {data.headlineSans}
          </div>
        </div>
        {data.body && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ body: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Saans", sans-serif', fontSize: 16,
              lineHeight: 1.5, color: '#01200d', maxWidth: 400,
            }}
          >
            {data.body}
          </div>
        )}
      </div>

      {/* Feature cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.cards.length, 4)}, 1fr)`, gap: 16, flex: 1 }}>
        {data.cards.map((card, i) => {
          const colors = CARD_COLORS[card.color] || CARD_COLORS.pink;
          return (
            <div
              key={i}
              style={{
                background: colors.bg,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateCard(i, { title: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Serrif VF", Georgia, serif',
                  fontSize: 32, fontWeight: 400, lineHeight: 0.9,
                  letterSpacing: '-0.96px', color: colors.text,
                  marginBottom: 16,
                }}
              >
                {card.title}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateCard(i, { description: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Saans", sans-serif',
                  fontSize: 14, lineHeight: 1.5, color: colors.text,
                }}
              >
                {card.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
