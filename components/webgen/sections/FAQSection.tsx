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

  const itemH = Math.min(96, Math.floor(560 / data.items.length));

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#00250e',
        padding: '64px',
        display: 'flex',
        gap: 64,
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left: headline */}
      <div style={{ width: 360, flexShrink: 0 }}>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ headline: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Serrif VF", Georgia, serif',
            fontSize: 44,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.88px',
            color: '#f8fffa',
          }}
        >
          {data.headline}
        </div>
      </div>

      {/* Right: accordion */}
      <div style={{ flex: 1 }}>
        {data.items.map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${Math.min(20, itemH / 3)}px 0`,
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
                  fontSize: 20,
                  lineHeight: 1.3,
                  color: '#f8fffa',
                  flex: 1,
                }}
              >
                {item.question}
              </div>
              <span style={{
                color: '#f8fffa', fontSize: 20, fontWeight: 300,
                flexShrink: 0, marginLeft: 16,
                transition: 'transform 0.2s',
                transform: openIndex === i ? 'rotate(45deg)' : 'none',
              }}>
                +
              </span>
            </div>
            <div style={{
              maxHeight: openIndex === i ? 200 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateItem(i, { answer: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"Saans", "Inter", sans-serif',
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: 'rgba(248, 255, 250, 0.6)',
                  paddingBottom: 16,
                }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
