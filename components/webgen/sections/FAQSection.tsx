'use client';

import { useState } from 'react';
import { FAQSection as FAQData, FAQItem } from '@/lib/webgen';

interface Props {
  data: FAQData;
  onChange: (updated: FAQData) => void;
}

export default function FAQSection({ data, onChange }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const update = (fields: Partial<FAQData>) => onChange({ ...data, ...fields });

  const updateItem = (idx: number, fields: Partial<FAQItem>) => {
    const items = data.items.map((item, i) => (i === idx ? { ...item, ...fields } : item));
    update({ items });
  };

  return (
    <section
      style={{
        background: '#00250e',
        padding: '120px 48px',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        gap: 80,
        alignItems: 'flex-start',
      }}>
        {/* Left: headline */}
        <div style={{ flex: '0 0 400px' }}>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ headline: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Serrif VF", Georgia, serif',
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.96px',
              color: '#f8fffa',
              position: 'sticky',
              top: 120,
            }}
          >
            {data.headline}
          </div>
        </div>

        {/* Right: accordion */}
        <div style={{ flex: 1 }}>
          {data.items.map((item, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Question row */}
              <div
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '28px 0',
                  cursor: 'pointer',
                }}
              >
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => updateItem(i, { question: e.currentTarget.textContent || '' })}
                  style={{
                    fontFamily: '"Saans", "Inter", sans-serif',
                    fontSize: 24,
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: '#f8fffa',
                    flex: 1,
                  }}
                >
                  {item.question}
                </div>
                <span style={{
                  color: '#f8fffa',
                  fontSize: 24,
                  fontWeight: 300,
                  flexShrink: 0,
                  marginLeft: 24,
                  transition: 'transform 0.2s',
                  transform: openIndex === i ? 'rotate(45deg)' : 'none',
                }}>
                  +
                </span>
              </div>

              {/* Answer */}
              <div style={{
                maxHeight: openIndex === i ? 400 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(i, { answer: e.currentTarget.textContent || '' })}
                  style={{
                    fontFamily: '"Saans", "Inter", sans-serif',
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: 'rgba(248, 255, 250, 0.7)',
                    paddingBottom: 28,
                  }}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
