'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Scale to fit viewport ──────────────────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;
    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const pad = 48;
      const scaleX = (width - pad * 2) / 1280;
      const scaleY = (height - pad * 2) / 720;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    // Don't navigate when editing text
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(sections.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    }
  }, [sections.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // ── Section operations ─────────────────────────────────────────────────
  const updateSection = (idx: number, updated: WebSection) => {
    onChange(sections.map((s, i) => (i === idx ? updated : s)));
  };

  const deleteSection = (idx: number) => {
    if (sections.length <= 1) return;
    const next = sections.filter((_, i) => i !== idx);
    onChange(next);
    setActiveIndex(Math.min(activeIndex, next.length - 1));
  };

  const addSection = (type: WebSection['type']) => {
    const template = { ...defaultSectionByType[type], id: `wg-${Date.now()}` };
    const next = [...sections];
    next.splice(activeIndex + 1, 0, template);
    onChange(next);
    setActiveIndex(activeIndex + 1);
    setAddMenuOpen(false);
  };

  const moveSection = (dir: -1 | 1) => {
    const target = activeIndex + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[activeIndex], next[target]] = [next[target], next[activeIndex]];
    onChange(next);
    setActiveIndex(target);
  };

  // ── Render active section ──────────────────────────────────────────────
  const activeSection = sections[activeIndex];

  const renderSection = (section: WebSection) => {
    const handler = (updated: WebSection) => updateSection(activeIndex, updated);
    switch (section.type) {
      case 'hero': return <HeroSection data={section} onChange={(u) => handler(u)} />;
      case 'stats': return <StatsSection data={section} onChange={(u) => handler(u)} />;
      case 'testimonial': return <TestimonialSection data={section} onChange={(u) => handler(u)} />;
      case 'features': return <FeaturesSection data={section} onChange={(u) => handler(u)} />;
      case 'manifesto': return <ManifestoSection data={section} onChange={(u) => handler(u)} />;
      case 'faq': return <FAQSection data={section} onChange={(u) => handler(u)} />;
      case 'cta': return <CTASection data={section} onChange={(u) => handler(u)} />;
      case 'social-proof': return <SocialProofSection data={section} onChange={(u) => handler(u)} />;
      default: return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#111111',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Saans", sans-serif',
    }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{
        height: 48,
        background: '#111111',
        borderBottom: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.4)', fontSize: 13,
              fontFamily: '"Saans", sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <i className="ri-arrow-left-line" /> Back
          </button>
          <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />
          <AirOpsLogo color="#ffffff" width={72} />
          <span style={{
            fontFamily: '"Saans Mono", monospace', fontSize: 10,
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}>
            DeckGen
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Reorder buttons */}
          <button
            onClick={() => moveSection(-1)}
            disabled={activeIndex === 0}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: activeIndex === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
              fontSize: 14, cursor: activeIndex === 0 ? 'default' : 'pointer',
              padding: '4px 8px', lineHeight: 1,
            }}
            title="Move slide left"
          >
            <i className="ri-arrow-up-s-line" />
          </button>
          <button
            onClick={() => moveSection(1)}
            disabled={activeIndex === sections.length - 1}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: activeIndex === sections.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
              fontSize: 14, cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer',
              padding: '4px 8px', lineHeight: 1,
            }}
            title="Move slide right"
          >
            <i className="ri-arrow-down-s-line" />
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteSection(activeIndex)}
            disabled={sections.length <= 1}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: sections.length <= 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,80,80,0.6)',
              fontSize: 14, cursor: sections.length <= 1 ? 'default' : 'pointer',
              padding: '4px 8px', lineHeight: 1,
            }}
            title="Delete slide"
          >
            <i className="ri-delete-bin-line" />
          </button>

          <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />

          {/* Add section */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              style={{
                background: 'rgba(0,255,100,0.08)', border: '1px solid rgba(0,255,100,0.2)',
                color: '#00ff64', fontFamily: '"Saans", sans-serif',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                padding: '5px 14px', borderRadius: 0,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <i className="ri-add-line" /> Add slide
            </button>
            {addMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setAddMenuOpen(false)} />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 4,
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  minWidth: 180, zIndex: 200,
                }}>
                  {ADD_SECTION_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      style={{
                        display: 'block', width: '100%', background: 'transparent',
                        border: 'none', borderBottom: '1px solid #2a2a2a',
                        color: 'rgba(255,255,255,0.6)', fontFamily: '"Saans", sans-serif',
                        fontSize: 12, padding: '8px 14px', cursor: 'pointer', textAlign: 'left',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,100,0.06)'; e.currentTarget.style.color = '#00ff64'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                      {SECTION_LABELS[type]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main canvas area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Prev arrow */}
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
          style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            zIndex: 50, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
            color: activeIndex === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
            fontFamily: '"Saans", sans-serif', fontSize: 20,
            cursor: activeIndex === 0 ? 'default' : 'pointer',
            padding: '12px 14px', backdropFilter: 'blur(8px)', lineHeight: 1,
          }}
        >
          &#8592;
        </button>

        {/* Next arrow */}
        <button
          onClick={() => setActiveIndex((i) => Math.min(sections.length - 1, i + 1))}
          disabled={activeIndex === sections.length - 1}
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            zIndex: 50, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
            color: activeIndex === sections.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
            fontFamily: '"Saans", sans-serif', fontSize: 20,
            cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer',
            padding: '12px 14px', backdropFilter: 'blur(8px)', lineHeight: 1,
          }}
        >
          &#8594;
        </button>

        {/* Canvas container */}
        <div
          ref={canvasRef}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 16:9 slide frame */}
          <div style={{
            width: 1280,
            height: 720,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}>
            {activeSection && renderSection(activeSection)}
          </div>
        </div>
      </div>

      {/* ── Bottom nav bar ──────────────────────────────────────────────── */}
      <div style={{
        height: 56,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 20,
        flexShrink: 0,
        zIndex: 100,
      }}>
        {/* Counter */}
        <div style={{
          fontFamily: '"Saans Mono", monospace', fontSize: 12,
          fontWeight: 500, letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)', flexShrink: 0,
          minWidth: 50,
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
        </div>

        {/* Dot progress bar */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1 }}>
          {sections.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex ? 20 : 5,
                height: 5,
                background: i === activeIndex ? '#00ff64' : 'rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'width 0.2s, background 0.2s',
              }}
            />
          ))}
        </div>

        {/* Slide type label */}
        <div style={{
          fontFamily: '"Saans Mono", monospace', fontSize: 10,
          fontWeight: 500, letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.3)',
        }}>
          {activeSection ? SECTION_LABELS[activeSection.type] : ''}
        </div>
      </div>
    </div>
  );
}
