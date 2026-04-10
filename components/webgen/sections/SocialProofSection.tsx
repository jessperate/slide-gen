'use client';

import { SocialProofSection as SocialProofData, SocialProofQuote } from '@/lib/webgen';

interface Props {
  data: SocialProofData;
  onChange: (updated: SocialProofData) => void;
}

const QUOTE_COLORS: Record<string, { bg: string; text: string }> = {
  yellow: { bg: '#EEFF8C', text: '#002910' },
  pink:   { bg: '#fee7fd', text: '#3a092c' },
  green:  { bg: '#ccffe0', text: '#002910' },
  blue:   { bg: '#e5e5ff', text: '#0f0f57' },
  purple: { bg: '#ddd3f2', text: '#2a084d' },
  teal:   { bg: '#c9ebf2', text: '#0a3945' },
};

export default function SocialProofSection({ data, onChange }: Props) {
  const update = (fields: Partial<SocialProofData>) => onChange({ ...data, ...fields });
  const updateQuote = (idx: number, fields: Partial<SocialProofQuote>) => {
    const quotes = data.quotes.map((q, i) => (i === idx ? { ...q, ...fields } : q));
    update({ quotes });
  };

  const cols = Math.min(data.quotes.length, 3);

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#ffffff',
        padding: '56px 64px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {(data.headlineSerif || data.headlineSans) && (
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          {data.headlineSerif && (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update({ headlineSerif: e.currentTarget.textContent || '' })}
              style={{
                fontFamily: '"Serrif VF", Georgia, serif',
                fontSize: 48, fontWeight: 400, lineHeight: 1.1,
                letterSpacing: '-1.44px', color: '#002910',
              }}
            >
              {data.headlineSerif}
            </div>
          )}
          {data.headlineSans && (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update({ headlineSans: e.currentTarget.textContent || '' })}
              style={{
                fontFamily: '"Saans", "Inter", sans-serif',
                fontSize: 48, fontWeight: 400, lineHeight: 1.0,
                letterSpacing: '-1.44px', color: '#002910',
              }}
            >
              {data.headlineSans}
            </div>
          )}
        </div>
      )}

      {/* Quote cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 16,
        flex: 1,
      }}>
        {data.quotes.map((q, i) => {
          const colors = QUOTE_COLORS[q.color] || QUOTE_COLORS.green;
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
                onBlur={(e) => updateQuote(i, { quote: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Saans", sans-serif',
                  fontSize: 16, fontStyle: 'italic',
                  lineHeight: 1.5, color: colors.text,
                  marginBottom: 20,
                }}
              >
                &ldquo;{q.quote}&rdquo;
              </div>
              <div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateQuote(i, { attribution: e.currentTarget.textContent || '' })}
                  style={{
                    fontFamily: '"Saans", sans-serif',
                    fontSize: 13, fontWeight: 600, color: colors.text,
                  }}
                >
                  {q.attribution}
                </div>
                {q.company && (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateQuote(i, { company: e.currentTarget.textContent || '' })}
                    style={{
                      fontFamily: '"Saans", sans-serif',
                      fontSize: 12, color: colors.text, opacity: 0.6, marginTop: 2,
                    }}
                  >
                    {q.company}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
