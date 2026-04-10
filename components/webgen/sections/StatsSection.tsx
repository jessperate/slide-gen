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

  const cardH = data.cards.length > 3 ? 260 : 340;

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#00250e',
        border: '1px solid #057a28',
        padding: '56px 64px',
        display: 'flex',
        flexDirection: 'column',
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
            fontSize: 13,
            fontWeight: 500,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.84px',
            color: '#c0ffd2',
            padding: '6px 14px',
            border: '1px solid #c0ffd2',
            borderRadius: 5,
            background: '#000d05',
            marginBottom: 24,
            display: 'inline-flex',
            width: 'fit-content',
            lineHeight: 1.3,
          }}
        >
          {data.eyebrow}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ headlineSerif: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Serrif VF", Georgia, serif',
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: '-1.44px',
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
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: '-1.44px',
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
              fontSize: 16,
              lineHeight: 1.5,
              color: 'rgba(248,255,250,0.7)',
              maxWidth: 360,
              textAlign: 'right',
            }}
          >
            {data.body}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        {data.cards.map((card, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: '#004319',
              border: '1px solid #005e1f',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: cardH,
            }}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateCard(i, { heading: e.currentTarget.textContent || '' })}
              style={{
                fontFamily: '"Saans", "Inter", sans-serif',
                fontSize: 18,
                lineHeight: 1.3,
                color: '#f8fffa',
              }}
            >
              {card.heading}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateCard(i, { stat: e.currentTarget.textContent || '' })}
                  style={{
                    fontFamily: '"Serrif VF", Georgia, serif',
                    fontSize: 72,
                    fontWeight: 400,
                    lineHeight: 0.84,
                    letterSpacing: '-2.88px',
                    color: '#f8fffa',
                  }}
                >
                  {card.stat}
                </div>
                <span style={{
                  fontSize: 20,
                  color: '#f8fffa',
                  transform: card.direction === 'up' ? 'rotate(0)' : 'rotate(180deg)',
                }}>
                  &#8593;
                </span>
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateCard(i, { description: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Saans", "Inter", sans-serif',
                  fontSize: 16,
                  lineHeight: 1.3,
                  color: 'rgba(248,255,250,0.7)',
                }}
              >
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
