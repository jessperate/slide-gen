'use client';

import { useState } from 'react';
import { WebSection, defaultSectionByType } from '@/lib/webgen';
import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import TestimonialSection from './sections/TestimonialSection';
import FeaturesSection from './sections/FeaturesSection';
import ManifestoSection from './sections/ManifestoSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';
import SocialProofSection from './sections/SocialProofSection';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  sections: WebSection[];
  onChange: (sections: WebSection[]) => void;
  onBack: () => void;
}

const SECTION_LABELS: Record<WebSection['type'], string> = {
  hero: 'Hero',
  stats: 'Stats',
  testimonial: 'Testimonial',
  features: 'Features',
  manifesto: 'Manifesto',
  faq: 'FAQ',
  cta: 'Call to Action',
  'social-proof': 'Social Proof',
};

const ADD_SECTION_TYPES: WebSection['type'][] = [
  'hero', 'stats', 'testimonial', 'features', 'manifesto', 'faq', 'cta', 'social-proof',
];

export default function WebGenEditor({ sections, onChange, onBack }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const updateSection = (idx: number, updated: WebSection) => {
    onChange(sections.map((s, i) => (i === idx ? updated : s)));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const deleteSection = (idx: number) => {
    onChange(sections.filter((_, i) => i !== idx));
  };

  const addSection = (type: WebSection['type']) => {
    const template = { ...defaultSectionByType[type], id: `wg-${Date.now()}` };
    onChange([...sections, template]);
    setAddMenuOpen(false);
    // Scroll to bottom after add
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  const renderSection = (section: WebSection, idx: number) => {
    const props = {
      onChange: (updated: WebSection) => updateSection(idx, updated),
    };

    switch (section.type) {
      case 'hero':
        return <HeroSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'stats':
        return <StatsSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'testimonial':
        return <TestimonialSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'features':
        return <FeaturesSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'manifesto':
        return <ManifestoSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'faq':
        return <FAQSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'cta':
        return <CTASection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      case 'social-proof':
        return <SocialProofSection data={section} {...props} onChange={(u) => updateSection(idx, u)} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fffa' }}>
      {/* Top bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(0, 41, 16, 0.95)',
          backdropFilter: 'blur(12px)',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid rgba(0, 255, 100, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 0',
            }}
          >
            <i className="ri-arrow-left-line" /> Back
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <AirOpsLogo color="#ffffff" width={80} />
          <span style={{
            fontFamily: '"Saans Mono", monospace',
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}>
            PageGen
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Add section button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              style={{
                background: 'rgba(0,255,100,0.1)',
                border: '1px solid rgba(0,255,100,0.2)',
                color: '#00ff64',
                fontFamily: '"Saans", sans-serif',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                padding: '6px 16px',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <i className="ri-add-line" /> Add section
            </button>

            {addMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  background: '#001a0b',
                  border: '1px solid rgba(0,255,100,0.15)',
                  minWidth: 200,
                  zIndex: 200,
                }}
              >
                {ADD_SECTION_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    style={{
                      display: 'block',
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(0,255,100,0.06)',
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: '"Saans", sans-serif',
                      fontSize: 13,
                      padding: '10px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,255,100,0.08)';
                      e.currentTarget.style.color = '#00ff64';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }}
                  >
                    {SECTION_LABELS[type]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span style={{
            fontFamily: '"Saans Mono", monospace',
            fontSize: 11,
            color: 'rgba(255,255,255,0.25)',
          }}>
            {sections.length} sections
          </span>
        </div>
      </div>

      {/* Click-away for add menu */}
      {addMenuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setAddMenuOpen(false)}
        />
      )}

      {/* Sections */}
      <div style={{ paddingTop: 56 }}>
        {sections.map((section, idx) => (
          <div
            key={section.id}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Section controls */}
            {hoveredIdx === idx && (
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 50,
                  display: 'flex',
                  gap: 4,
                  background: 'rgba(0, 41, 16, 0.9)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 6px',
                  border: '1px solid rgba(0,255,100,0.15)',
                }}
              >
                <span style={{
                  fontFamily: '"Saans Mono", monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  padding: '4px 8px',
                  alignSelf: 'center',
                }}>
                  {SECTION_LABELS[section.type]}
                </span>
                <button
                  onClick={() => moveSection(idx, -1)}
                  disabled={idx === 0}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: idx === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    cursor: idx === 0 ? 'default' : 'pointer',
                    fontSize: 16,
                    padding: '4px 6px',
                  }}
                  title="Move up"
                >
                  <i className="ri-arrow-up-s-line" />
                </button>
                <button
                  onClick={() => moveSection(idx, 1)}
                  disabled={idx === sections.length - 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: idx === sections.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    cursor: idx === sections.length - 1 ? 'default' : 'pointer',
                    fontSize: 16,
                    padding: '4px 6px',
                  }}
                  title="Move down"
                >
                  <i className="ri-arrow-down-s-line" />
                </button>
                <button
                  onClick={() => deleteSection(idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,100,100,0.7)',
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: '4px 6px',
                  }}
                  title="Delete section"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            )}

            {renderSection(section, idx)}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        background: '#002910',
        padding: '48px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <AirOpsLogo color="rgba(255,255,255,0.3)" width={120} />
      </div>
    </div>
  );
}
