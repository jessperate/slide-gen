'use client';

import { FeaturesSection as FeaturesData, FeatureCard } from '@/lib/webgen';

interface Props {
  data: FeaturesData;
  onChange: (updated: FeaturesData) => void;
}

const CARD_COLORS: Record<string, { bg: string; tint: string }> = {
  pink:   { bg: '#fee7fd', tint: 'rgba(255,247,255,0.8)' },
  red:    { bg: '#ffe2e2', tint: 'rgba(255,240,240,0.8)' },
  yellow: { bg: '#f9ffd4', tint: 'rgba(252,255,236,0.8)' },
  indigo: { bg: '#eaeaff', tint: 'rgba(251,251,255,0.8)' },
};

export default function FeaturesSection({ data, onChange }: Props) {
  const update = (fields: Partial<FeaturesData>) => onChange({ ...data, ...fields });
  const updateCard = (idx: number, fields: Partial<FeatureCard>) => {
    const cards = data.cards.map((c, i) => (i === idx ? { ...c, ...fields } : c));
    update({ cards });
  };

  return (
    <section
      style={{
        background: '#ffffff',
        backgroundImage: 'radial-gradient(#d4e8da 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        padding: '120px 48px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
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

          <div style={{ maxWidth: 598 }}>
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
                letterSpacing: '-2.16px',
                color: '#002910',
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
                fontFamily: '"Saans", "Inter", sans-serif',
                fontSize: 18,
                lineHeight: 1.5,
                color: '#01200d',
                marginTop: 24,
                maxWidth: 600,
              }}
            >
              {data.body}
            </div>
          )}
        </div>

        {/* Feature cards — stacked */}
        <div style={{ border: '1.5px solid #01200d', display: 'flex', flexDirection: 'column' }}>
          {data.cards.map((card, i) => {
            const colors = CARD_COLORS[card.color] || CARD_COLORS.pink;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  minHeight: 400,
                  borderBottom: i < data.cards.length - 1 ? '1.5px solid #01200d' : undefined,
                }}
              >
                {/* Content side */}
                <div style={{
                  flex: 1,
                  padding: 48,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: '#ffffff',
                }}>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateCard(i, { title: e.currentTarget.textContent || '' })}
                    style={{
                      fontFamily: '"Serrif VF", Georgia, serif',
                      fontSize: 48,
                      fontWeight: 400,
                      lineHeight: 0.9,
                      letterSpacing: '-1.92px',
                      color: '#01200d',
                      marginBottom: 24,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateCard(i, { description: e.currentTarget.textContent || '' })}
                    style={{
                      fontFamily: '"Saans", "Inter", sans-serif',
                      fontSize: 18,
                      lineHeight: 1.5,
                      color: '#01200d',
                      marginBottom: 24,
                    }}
                  >
                    {card.description}
                  </div>
                  <div style={{
                    fontFamily: '"Saans", "Inter", sans-serif',
                    fontSize: 19,
                    fontWeight: 500,
                    color: '#01200d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}>
                    Learn more <i className="ri-arrow-right-line" style={{ fontSize: 20 }} />
                  </div>
                </div>

                {/* Color side */}
                <div style={{
                  flex: 1,
                  background: colors.bg,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: colors.tint,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
