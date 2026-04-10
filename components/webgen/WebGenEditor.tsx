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
import ContentImageSection from './sections/ContentImageSection';
import AirOpsLogo from '@/components/AirOpsLogo';

// ── Popular Remix Icons for the picker ─────────────────────────────────────
const ICON_SET = [
  'ri-rocket-line','ri-lightbulb-line','ri-bar-chart-box-line','ri-pie-chart-line',
  'ri-line-chart-line','ri-trophy-line','ri-medal-line','ri-star-line',
  'ri-heart-line','ri-shield-check-line','ri-lock-line','ri-eye-line',
  'ri-search-line','ri-magic-line','ri-sparkling-line','ri-brain-line',
  'ri-robot-line','ri-code-line','ri-terminal-box-line','ri-database-line',
  'ri-cloud-line','ri-global-line','ri-earth-line','ri-map-pin-line',
  'ri-team-line','ri-user-star-line','ri-customer-service-line','ri-hand-heart-line',
  'ri-megaphone-line','ri-mail-line','ri-chat-1-line','ri-question-line',
  'ri-check-double-line','ri-checkbox-circle-line','ri-arrow-right-up-line',
  'ri-speed-line','ri-timer-line','ri-calendar-line','ri-bookmark-line',
  'ri-flag-line','ri-target-line','ri-focus-line','ri-compass-line',
  'ri-tools-line','ri-settings-line','ri-equalizer-line','ri-palette-line',
];

interface Props {
  sections: WebSection[];
  onChange: (sections: WebSection[]) => void;
  onBack: () => void;
}

interface ImageOverlay {
  id: string;
  url: string;
  x: number;   // % of 1280
  y: number;   // % of 720
  width: number; // px at 1280
}

const SECTION_LABELS: Record<WebSection['type'], string> = {
  hero: 'Hero', stats: 'Stats', testimonial: 'Testimonial',
  features: 'Features', manifesto: 'Manifesto', faq: 'FAQ',
  cta: 'Call to Action', 'social-proof': 'Social Proof',
  'content-image': 'Content + Image',
};

const ADD_SECTION_TYPES: WebSection['type'][] = [
  'hero', 'stats', 'testimonial', 'features', 'content-image', 'manifesto', 'faq', 'cta', 'social-proof',
];

export default function WebGenEditor({ sections, onChange, onBack }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const [presentScale, setPresentScale] = useState(1);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [imageOverlays, setImageOverlays] = useState<Record<string, ImageOverlay[]>>({});
  const [draggingImage, setDraggingImage] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const savedRangeRef = useRef<Range | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const presentRef = useRef<HTMLDivElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

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

  // ── Present scale ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!presenting) return;
    const update = () => {
      setPresentScale(Math.min(window.innerWidth / 1280, window.innerHeight / 720));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [presenting]);

  // ── Keyboard navigation ────────────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

    if (e.key === 'Escape' && presenting) {
      setPresenting(false);
      document.exitFullscreen?.().catch(() => {});
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || (presenting && e.key === ' ')) {
      e.preventDefault();
      setActiveIndex((i) => Math.min(sections.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    }
  }, [sections.length, presenting]);

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

  // ── Image overlays ────────────────────────────────────────────────────
  const activeSection = sections[activeIndex];
  const slideId = activeSection?.id || '';
  const currentOverlays = imageOverlays[slideId] || [];

  const handleImageUpload = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const overlay: ImageOverlay = {
        id: `img-${Date.now()}`,
        url: e.target?.result as string,
        x: 50, y: 50,
        width: 200,
      };
      setImageOverlays((prev) => ({
        ...prev,
        [slideId]: [...(prev[slideId] || []), overlay],
      }));
    };
    reader.readAsDataURL(file);
  };

  const deleteOverlay = (overlayId: string) => {
    setImageOverlays((prev) => ({
      ...prev,
      [slideId]: (prev[slideId] || []).filter((o) => o.id !== overlayId),
    }));
  };

  const handleOverlayMouseDown = (overlayId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingImage(overlayId);
    const overlay = currentOverlays.find((o) => o.id === overlayId);
    if (!overlay) return;
    setDragOffset({
      x: e.clientX / scale - (overlay.x / 100) * 1280,
      y: e.clientY / scale - (overlay.y / 100) * 720,
    });
  };

  useEffect(() => {
    if (!draggingImage) return;
    const onMove = (e: MouseEvent) => {
      const newX = ((e.clientX / scale - dragOffset.x) / 1280) * 100;
      const newY = ((e.clientY / scale - dragOffset.y) / 720) * 100;
      setImageOverlays((prev) => ({
        ...prev,
        [slideId]: (prev[slideId] || []).map((o) =>
          o.id === draggingImage ? { ...o, x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) } : o
        ),
      }));
    };
    const onUp = () => setDraggingImage(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [draggingImage, dragOffset, scale, slideId]);

  const resizeOverlay = (overlayId: string, delta: number) => {
    setImageOverlays((prev) => ({
      ...prev,
      [slideId]: (prev[slideId] || []).map((o) =>
        o.id === overlayId ? { ...o, width: Math.max(60, Math.min(800, o.width + delta)) } : o
      ),
    }));
  };

  // ── Present mode ──────────────────────────────────────────────────────
  const startPresenting = () => {
    setPresenting(true);
    presentRef.current?.requestFullscreen?.().catch(() => {});
  };

  // ── Save selection before opening icon picker ──────────────────────────
  const openIconPicker = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
    setIconPickerOpen(true);
  };

  // ── Insert icon at saved cursor position ──────────────────────────────
  const insertIcon = (iconClass: string) => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style.fontSize = '1.2em';
    icon.style.verticalAlign = 'middle';
    icon.style.marginRight = '4px';
    range.insertNode(icon);
    range.collapse(false);
    savedRangeRef.current = null;
    setIconPickerOpen(false);
  };

  // ── Render section ────────────────────────────────────────────────────
  const renderSection = (section: WebSection, interactive: boolean) => {
    const handler = interactive ? (updated: WebSection) => updateSection(activeIndex, updated) : () => {};
    switch (section.type) {
      case 'hero': return <HeroSection data={section} onChange={(u) => handler(u)} />;
      case 'stats': return <StatsSection data={section} onChange={(u) => handler(u)} />;
      case 'testimonial': return <TestimonialSection data={section} onChange={(u) => handler(u)} />;
      case 'features': return <FeaturesSection data={section} onChange={(u) => handler(u)} />;
      case 'manifesto': return <ManifestoSection data={section} onChange={(u) => handler(u)} />;
      case 'faq': return <FAQSection data={section} onChange={(u) => handler(u)} />;
      case 'cta': return <CTASection data={section} onChange={(u) => handler(u)} />;
      case 'social-proof': return <SocialProofSection data={section} onChange={(u) => handler(u)} />;
      case 'content-image': return <ContentImageSection data={section} onChange={(u) => handler(u)} />;
      default: return null;
    }
  };

  // ── Logo + image overlays layer ───────────────────────────────────────
  const renderOverlays = (overlays: ImageOverlay[], interactive: boolean) => (
    <>
      {overlays.map((o) => (
        <div
          key={o.id}
          onMouseDown={interactive ? (e) => handleOverlayMouseDown(o.id, e) : undefined}
          style={{
            position: 'absolute',
            left: `${o.x}%`, top: `${o.y}%`,
            transform: 'translate(-50%, -50%)',
            width: o.width,
            cursor: interactive ? 'move' : 'default',
            zIndex: 20,
            userSelect: 'none',
          }}
        >
          <img src={o.url} alt="" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
          {interactive && (
            <div style={{
              position: 'absolute', top: -8, right: -8,
              display: 'flex', gap: 2,
            }}>
              <button
                onMouseDown={(e) => { e.stopPropagation(); resizeOverlay(o.id, -20); }}
                style={{ width: 20, height: 20, background: '#111', border: '1px solid #444', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}
              >-</button>
              <button
                onMouseDown={(e) => { e.stopPropagation(); resizeOverlay(o.id, 20); }}
                style={{ width: 20, height: 20, background: '#111', border: '1px solid #444', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}
              >+</button>
              <button
                onMouseDown={(e) => { e.stopPropagation(); deleteOverlay(o.id); }}
                style={{ width: 20, height: 20, background: '#111', border: '1px solid #444', color: '#f66', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}
              >&#10005;</button>
            </div>
          )}
        </div>
      ))}
    </>
  );

  const renderLogo = () => {
    if (!showLogo) return null;
    return (
      <div style={{
        position: 'absolute', bottom: 20, right: 24,
        zIndex: 30, opacity: 0.5,
      }}>
        <AirOpsLogo color={
          activeSection?.type === 'hero' || activeSection?.type === 'features' || activeSection?.type === 'social-proof'
            ? '#002910' : '#f8fffa'
        } width={80} />
      </div>
    );
  };

  // ── Fullscreen presentation ───────────────────────────────────────────
  if (presenting) {
    const presSection = sections[activeIndex];
    const presOverlays = imageOverlays[presSection?.id || ''] || [];
    return (
      <div
        ref={presentRef}
        style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setActiveIndex((i) => Math.min(sections.length - 1, i + 1))}
      >
        <div style={{ width: 1280, height: 720, transform: `scale(${presentScale})`, transformOrigin: 'center center', position: 'relative', overflow: 'hidden' }}>
          {presSection && renderSection(presSection, false)}
          {renderOverlays(presOverlays, false)}
          {renderLogo()}
        </div>

        {/* Bottom bar */}
        <div
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 20, padding: '10px 24px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
            {activeIndex + 1} / {sections.length}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1 }}>
            {sections.map((_, i) => (
              <div key={i} onClick={() => setActiveIndex(i)} style={{ width: i === activeIndex ? 16 : 4, height: 4, background: i === activeIndex ? '#00ff64' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'width 0.2s, background 0.2s' }} />
            ))}
          </div>
          <button
            onClick={() => { setPresenting(false); document.exitFullscreen?.().catch(() => {}); }}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontFamily: '"Saans", sans-serif', fontSize: 12, padding: '5px 14px', cursor: 'pointer' }}
          >
            Exit
          </button>
        </div>

        {/* Prev/Next */}
        <button
          onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => Math.max(0, i - 1)); }}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: activeIndex === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)', fontSize: 20, padding: '12px 14px', cursor: activeIndex === 0 ? 'default' : 'pointer', lineHeight: 1 }}
        >&#8592;</button>
        <button
          onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => Math.min(sections.length - 1, i + 1)); }}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: activeIndex === sections.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)', fontSize: 20, padding: '12px 14px', cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer', lineHeight: 1 }}
        >&#8594;</button>
      </div>
    );
  }

  // ── Editor mode ───────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#111111', display: 'flex', flexDirection: 'column', fontFamily: '"Saans", sans-serif' }}>
      {/* Hidden file input */}
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)} />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{ height: 48, background: '#111111', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: '"Saans", sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="ri-arrow-left-line" /> Back
          </button>
          <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />
          <AirOpsLogo color="#ffffff" width={68} />
        </div>

        {/* Center toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Move */}
          <button onClick={() => moveSection(-1)} disabled={activeIndex === 0} title="Move left" style={{ background: 'transparent', border: '1px solid #2a2a2a', color: activeIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)', fontSize: 14, cursor: activeIndex === 0 ? 'default' : 'pointer', padding: '4px 7px', lineHeight: 1 }}>
            <i className="ri-arrow-left-s-line" />
          </button>
          <button onClick={() => moveSection(1)} disabled={activeIndex === sections.length - 1} title="Move right" style={{ background: 'transparent', border: '1px solid #2a2a2a', color: activeIndex === sections.length - 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)', fontSize: 14, cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer', padding: '4px 7px', lineHeight: 1 }}>
            <i className="ri-arrow-right-s-line" />
          </button>

          <div style={{ width: 1, height: 16, background: '#2a2a2a', margin: '0 4px' }} />

          {/* Add image */}
          <button onClick={() => imgInputRef.current?.click()} title="Add image" style={{ background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.5)', fontSize: 14, padding: '4px 7px', cursor: 'pointer', lineHeight: 1 }}>
            <i className="ri-image-add-line" />
          </button>

          {/* Icon picker */}
          <div style={{ position: 'relative' }}>
            <button onMouseDown={(e) => { e.preventDefault(); iconPickerOpen ? setIconPickerOpen(false) : openIconPicker(); }} title="Insert icon" style={{ background: iconPickerOpen ? 'rgba(0,255,100,0.1)' : 'transparent', border: '1px solid #2a2a2a', color: iconPickerOpen ? '#00ff64' : 'rgba(255,255,255,0.5)', fontSize: 14, padding: '4px 7px', cursor: 'pointer', lineHeight: 1 }}>
              <i className="ri-sparkling-line" />
            </button>
            {iconPickerOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setIconPickerOpen(false)} />
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 4, background: '#1a1a1a', border: '1px solid #2a2a2a', padding: 8, zIndex: 200, width: 240, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <div style={{ width: '100%', fontFamily: '"Saans Mono", monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 4, padding: '0 4px' }}>
                    Click to insert at cursor
                  </div>
                  {ICON_SET.map((ic) => (
                    <button key={ic} onMouseDown={(e) => { e.preventDefault(); insertIcon(ic); }} title={ic.replace('ri-', '').replace('-line', '')} style={{ width: 28, height: 28, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,100,0.1)'; e.currentTarget.style.color = '#00ff64'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                      <i className={ic} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ width: 1, height: 16, background: '#2a2a2a', margin: '0 4px' }} />

          {/* Logo toggle */}
          <button onClick={() => setShowLogo(!showLogo)} title={showLogo ? 'Hide logo' : 'Show logo'} style={{ background: showLogo ? 'rgba(0,255,100,0.1)' : 'transparent', border: '1px solid #2a2a2a', color: showLogo ? '#00ff64' : 'rgba(255,255,255,0.3)', fontSize: 12, padding: '4px 8px', cursor: 'pointer', lineHeight: 1, fontFamily: '"Saans Mono", monospace', letterSpacing: '0.04em' }}>
            <i className="ri-copyright-line" style={{ marginRight: 4 }} />Logo
          </button>

          {/* Delete */}
          <button onClick={() => deleteSection(activeIndex)} disabled={sections.length <= 1} title="Delete slide" style={{ background: 'transparent', border: '1px solid #2a2a2a', color: sections.length <= 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,80,80,0.5)', fontSize: 14, cursor: sections.length <= 1 ? 'default' : 'pointer', padding: '4px 7px', lineHeight: 1 }}>
            <i className="ri-delete-bin-line" />
          </button>
        </div>

        {/* Right: add + present */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Add slide */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setAddMenuOpen(!addMenuOpen)} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.5)', fontFamily: '"Saans", sans-serif', fontSize: 12, cursor: 'pointer', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="ri-add-line" /> Add
            </button>
            {addMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setAddMenuOpen(false)} />
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#1a1a1a', border: '1px solid #2a2a2a', minWidth: 170, zIndex: 200 }}>
                  {ADD_SECTION_TYPES.map((type) => (
                    <button key={type} onClick={() => addSection(type)} style={{ display: 'block', width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: 'rgba(255,255,255,0.55)', fontFamily: '"Saans", sans-serif', fontSize: 12, padding: '7px 14px', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,100,0.06)'; e.currentTarget.style.color = '#00ff64'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                    >{SECTION_LABELS[type]}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Present */}
          <button onClick={startPresenting} style={{ background: '#00ff64', border: 'none', color: '#002910', fontFamily: '"Saans", sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '5px 16px', borderRadius: 58, display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="ri-play-fill" style={{ fontSize: 14 }} /> Present
          </button>
        </div>
      </div>

      {/* ── Main canvas area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Prev */}
        <button onClick={() => setActiveIndex((i) => Math.max(0, i - 1))} disabled={activeIndex === 0} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 50, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: activeIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)', fontSize: 18, cursor: activeIndex === 0 ? 'default' : 'pointer', padding: '10px 12px', lineHeight: 1 }}>
          &#8592;
        </button>
        {/* Next */}
        <button onClick={() => setActiveIndex((i) => Math.min(sections.length - 1, i + 1))} disabled={activeIndex === sections.length - 1} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 50, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: activeIndex === sections.length - 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)', fontSize: 18, cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer', padding: '10px 12px', lineHeight: 1 }}>
          &#8594;
        </button>

        <div ref={canvasRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 1280, height: 720, transform: `scale(${scale})`, transformOrigin: 'center center', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
            {activeSection && renderSection(activeSection, true)}
            {renderOverlays(currentOverlays, true)}
            {renderLogo()}
          </div>
        </div>
      </div>

      {/* ── Bottom nav bar ──────────────────────────────────────────────── */}
      <div style={{ height: 50, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderTop: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0, zIndex: 100 }}>
        <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', flexShrink: 0, minWidth: 48 }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1 }}>
          {sections.map((s, i) => (
            <div key={s.id} onClick={() => setActiveIndex(i)} style={{ width: i === activeIndex ? 18 : 5, height: 4, background: i === activeIndex ? '#00ff64' : 'rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'width 0.2s, background 0.2s' }} />
          ))}
        </div>
        <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)' }}>
          {activeSection ? SECTION_LABELS[activeSection.type] : ''}
        </div>
      </div>
    </div>
  );
}
