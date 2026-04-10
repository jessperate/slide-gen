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

  return (
    <section
      style={{
        background: '#ffffff',
        padding: '120px 48px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        {(data.headlineSerif || data.headlineSans) && (
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            {data.headlineSerif && (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => update({ headlineSerif: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Serrif VF", Georgia, serif',
                  fontSize: 56,
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: '-1.12px',
                  color: '#002910',
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
                  fontSize: 56,
                  fontWeight: 400,
                  lineHeight: 1.0,
                  letterSpacing: '-1.12px',
                  color: '#002910',
                }}
              >
                {data.headlineSans}
              </div>
            )}
          </div>
        )}

        {/* Quote cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {data.quotes.map((q, i) => {
            const colors = QUOTE_COLORS[q.color] || QUOTE_COLORS.green;
            return (
              <div
                key={i}
                style={{
                  background: colors.bg,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 240,
                }}
              >
                {/* Quote */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateQuote(i, { quote: e.currentTarget.textContent || '' })}
                  style={{
                    fontFamily: '"Saans", "Inter", sans-serif',
                    fontSize: 18,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    color: colors.text,
                    marginBottom: 24,
                  }}
                >
                  &ldquo;{q.quote}&rdquo;
                </div>

                {/* Attribution */}
                <div>
                  {q.company && (
                    <img
                      src={`https://logo.clearbit.com/${q.company.toLowerCase().replace(/\s+/g, '')}.com`}
                      alt={q.company}
                      style={{ height: 20, marginBottom: 8, opacity: 0.6 }}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateQuote(i, { attribution: e.currentTarget.textContent || '' })}
                      style={{
                        fontFamily: '"Saans", "Inter", sans-serif',
                        fontSize: 14,
                        fontWeight: 500,
                        color: colors.text,
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
                          fontFamily: '"Saans", "Inter", sans-serif',
                          fontSize: 14,
                          color: colors.text,
                          opacity: 0.7,
                        }}
                      >
                        {q.company}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
