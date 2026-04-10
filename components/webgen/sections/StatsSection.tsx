'use client';

import { StatsSection as StatsData, StatCard } from '@/lib/webgen';

interface Props {
  data: StatsData;
  onChange: (updated: StatsData) => void;
}

export default function StatsSection({ data, onChange }: Props) {
  const update = (fields: Partial<StatsData>) => onChange({ ...data, ...fields });
  const updateCard = (idx: number, fields: Partial<StatCard>) => {
    const cards = data.cards.map((c, i) => (i === idx ? { ...c, ...fields } : c));
    update({ cards });
  };

  return (
    <section
      style={{
        background: '#00250e',
        border: '1px solid #057a28',
        padding: '120px 48px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
              color: '#c0ffd2',
              padding: '8px 16px',
              border: '1px solid #c0ffd2',
              borderRadius: 5,
              background: '#000d05',
              marginBottom: 40,
              display: 'inline-flex',
              width: 'fit-content',
              lineHeight: 1.3,
            }}
          >
            {data.eyebrow}
          </div>
        )}

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 64, flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 600 }}>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update({ headlineSerif: e.currentTarget.textContent || '' })}
              style={{
                fontFamily: '"Serrif VF", Georgia, serif',
                fontSize: 64,
                fontWeight: 400,
                lineHeight: 1.0,
                letterSpacing: '-1.92px',
                color: '#f8fffa',
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
                fontSize: 64,
                fontWeight: 400,
                lineHeight: 1.0,
                letterSpacing: '-1.92px',
                color: '#f8fffa',
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
                color: '#f8fffa',
                maxWidth: 400,
                alignSelf: 'flex-end',
              }}
            >
              {data.body}
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {data.cards.map((card, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 320px',
                background: '#004319',
                border: '1px solid #005e1f',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 400,
              }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateCard(i, { heading: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Saans", "Inter", sans-serif',
                  fontSize: 24,
                  lineHeight: 1.3,
                  color: '#f8fffa',
                  marginBottom: 24,
                }}
              >
                {card.heading}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateCard(i, { stat: e.currentTarget.textContent || '' })}
                    style={{
                      fontFamily: '"Serrif VF", Georgia, serif',
                      fontSize: 96,
                      fontWeight: 400,
                      lineHeight: 0.84,
                      letterSpacing: '-3.84px',
                      color: '#f8fffa',
                    }}
                  >
                    {card.stat}
                  </div>
                  <svg
                    width="40"
                    height="20"
                    viewBox="0 0 40 20"
                    fill="none"
                    style={{
                      transform: card.direction === 'down' ? 'rotate(90deg)' : 'rotate(-90deg)',
                      flexShrink: 0,
                    }}
                  >
                    <path d="M0 10L40 10M40 10L30 0M40 10L30 20" stroke="#f8fffa" strokeWidth="2" />
                  </svg>
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateCard(i, { description: e.currentTarget.textContent || '' })}
                  style={{
                    fontFamily: '"Saans", "Inter", sans-serif',
                    fontSize: 20,
                    lineHeight: 1.3,
                    color: '#f8fffa',
                  }}
                >
                  {card.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
