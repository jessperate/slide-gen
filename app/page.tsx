'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SlideData, defaultSlides } from '@/lib/slides';
import { ColorMode, THEMES, DEFAULT_THEME } from '@/lib/themes';
import ThumbnailRail from '@/components/ThumbnailRail';
import EditPanel from '@/components/EditPanel';
import AddSlideModal from '@/components/AddSlideModal';
import OnboardingScreen from '@/components/OnboardingScreen';
import AirOpsLogo from '@/components/AirOpsLogo';
import { renderSlide } from '@/components/SlideCanvas';

const STORAGE_KEY = 'slidegen-current-deck';
const SAVED_KEY = 'slidegen-saved-deck';
const NOTES_KEY = 'slidegen-notes';
const THEME_KEY = 'slidegen-theme';
const SLIDE_COLORS_KEY = 'slidegen-slide-colors';

export default function SlideGenPage() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('slidegen-current-deck'); } catch { return true; }
  });
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
  const [hasSavedDeck, setHasSavedDeck] = useState(false);
  const [googleSetupNeeded, setGoogleSetupNeeded] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [presenting, setPresenting] = useState(false);
  const [presentIndex, setPresentIndex] = useState(0);
  const [presentScale, setPresentScale] = useState(1);
  const [showPresentControls, setShowPresentControls] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>('green');
  const [slideColorOverrides, setSlideColorOverrides] = useState<Record<string, ColorMode>>({});

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const presentContainerRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const activeSlide = slides[activeIndex];

  // Restore autosaved deck + notes on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
          // Onboarding always shows on landing — user can skip to continue previous deck
        }
      }
      const savedNotes = localStorage.getItem(NOTES_KEY);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      setHasSavedDeck(!!localStorage.getItem(SAVED_KEY));
      const savedTheme = localStorage.getItem(THEME_KEY) as ColorMode | null;
      if (savedTheme && THEMES[savedTheme]) setColorMode(savedTheme);
      const savedSlideColors = localStorage.getItem(SLIDE_COLORS_KEY);
      if (savedSlideColors) setSlideColorOverrides(JSON.parse(savedSlideColors));
    } catch {}
  }, []);

  // Autosave slides
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slides)); } catch {}
  }, [slides]);

  // Autosave notes
  useEffect(() => {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);

  // Autosave theme
  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, colorMode); } catch {}
  }, [colorMode]);

  // Autosave slide color overrides
  useEffect(() => {
    try { localStorage.setItem(SLIDE_COLORS_KEY, JSON.stringify(slideColorOverrides)); } catch {}
  }, [slideColorOverrides]);

  // Canvas scale
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const padding = 48;
      const scaleX = (width - padding * 2) / 1280;
      const scaleY = (height - padding * 2) / 720;
      setCanvasScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Presentation scale — fits viewport
  useEffect(() => {
    if (!presenting) return;
    const update = () => {
      const scaleX = window.innerWidth / 1280;
      const scaleY = window.innerHeight / 720;
      setPresentScale(Math.min(scaleX, scaleY));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [presenting]);

  // Keyboard nav in presentation mode
  const handlePresentKey = useCallback((e: KeyboardEvent) => {
    if (!presenting) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPresentIndex((i) => Math.min(slides.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPresentIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Escape') {
      setPresenting(false);
      document.exitFullscreen?.().catch(() => {});
    }
  }, [presenting, slides.length]);

  useEffect(() => {
    window.addEventListener('keydown', handlePresentKey);
    return () => window.removeEventListener('keydown', handlePresentKey);
  }, [handlePresentKey]);

  const startPresentation = () => {
    setPresentIndex(activeIndex);
    setShowPresentControls(false);
    setPresenting(true);
    presentContainerRef.current?.requestFullscreen?.().catch(() => {});
  };

  const handleGenerate = (rawSlides: unknown[]) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(slides));
      setHasSavedDeck(true);
    } catch {}
    setSlides(rawSlides as SlideData[]);
    setActiveIndex(0);
    setShowOnboarding(false);
  };

  const handleSkip = () => setShowOnboarding(false);

  const handleRestoreSaved = () => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(SAVED_KEY, JSON.stringify(slides));
        setSlides(parsed);
        setActiveIndex(0);
      }
    } catch {}
  };

  const updateSlide = (updated: SlideData) => {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const updateActiveSlide = (updates: Partial<SlideData>) => {
    setSlides((prev) =>
      prev.map((s, i) => i === activeIndex ? ({ ...s, ...updates } as SlideData) : s),
    );
  };

  const addSlide = (newSlide: SlideData) => {
    setSlides((prev) => {
      const next = [...prev];
      next.splice(activeIndex + 1, 0, newSlide);
      return next;
    });
    setActiveIndex(activeIndex + 1);
  };

  const handleGoogleSlides = async () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setGoogleSetupNeeded(true);
      return;
    }
    const { buildPptxBlob } = await import('@/lib/exportPptx');
    const { openInGoogleSlides } = await import('@/lib/googleSlides');
    setExportProgress({ current: 0, total: slides.length });
    try {
      const blob = await buildPptxBlob(
        slides,
        (s, interactive) => renderSlide(s, interactive, undefined, getSlideTheme(s)),
        (current, total) => { setExportProgress({ current, total }); },
      );
      setExportProgress({ current: slides.length, total: slides.length });
      await openInGoogleSlides(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setExportProgress(null);
    }
  };

  const theme = THEMES[colorMode] ?? DEFAULT_THEME;
  const getSlideTheme = (slide: SlideData) => THEMES[slideColorOverrides[slide.id] ?? colorMode] ?? theme;
  const activeSlideTheme = activeSlide ? getSlideTheme(activeSlide) : theme;
  const slideWidth = Math.round(1280 * canvasScale);
  const slideHeight = Math.round(720 * canvasScale);
  const activeNote = activeSlide ? (notes[activeSlide.id] ?? '') : '';

  return (
    <>
      {showOnboarding && (
        <OnboardingScreen onGenerate={handleGenerate} onSkip={handleSkip} />
      )}

      {/* Print output */}
      <div style={{ display: 'none' }} className="print-output">
        {slides.map((slide) => (
          <div key={slide.id} className="slide-for-print"
            style={{ width: 1280, height: 720, position: 'relative', overflow: 'hidden' }}>
            {renderSlide(slide, false, undefined, getSlideTheme(slide))}
          </div>
        ))}
      </div>

      {/* ── Presentation mode ── */}
      {presenting && (
        <div
          ref={presentContainerRef}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000000',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setPresentIndex((i) => Math.min(slides.length - 1, i + 1))}
          onMouseMove={() => setShowPresentControls(true)}
          onMouseLeave={() => setShowPresentControls(false)}
        >
          {/* Slide */}
          <div
            style={{
              width: Math.round(1280 * presentScale),
              height: Math.round(720 * presentScale),
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                transformOrigin: 'top left',
                transform: `scale(${presentScale})`,
                width: 1280,
                height: 720,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {renderSlide(slides[presentIndex], false, undefined, getSlideTheme(slides[presentIndex]))}
            </div>
          </div>

          {/* Exit button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPresenting(false);
              document.exitFullscreen?.().catch(() => {});
            }}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backdropFilter: 'blur(8px)',
              opacity: showPresentControls ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: showPresentControls ? 'auto' : 'none',
            }}
          >
            ✕ Exit
          </button>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); setPresentIndex((i) => Math.max(0, i - 1)); }}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: presentIndex === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 18,
              cursor: presentIndex === 0 ? 'default' : 'pointer',
              padding: '10px 14px',
              backdropFilter: 'blur(8px)',
              lineHeight: 1,
              opacity: showPresentControls ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: showPresentControls ? 'auto' : 'none',
            }}
          >
            ←
          </button>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); setPresentIndex((i) => Math.min(slides.length - 1, i + 1)); }}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: presentIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 18,
              cursor: presentIndex === slides.length - 1 ? 'default' : 'pointer',
              padding: '10px 14px',
              backdropFilter: 'blur(8px)',
              lineHeight: 1,
              opacity: showPresentControls ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: showPresentControls ? 'auto' : 'none',
            }}
          >
            →
          </button>

          {/* Slide counter + notes strip at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '10px 20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Counter */}
            <div
              style={{
                fontFamily: '"Saans Mono", monospace',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.4)',
                flexShrink: 0,
              }}
            >
              {presentIndex + 1} / {slides.length}
            </div>

            {/* Dot progress */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPresentIndex(i); }}
                  style={{
                    width: i === presentIndex ? 16 : 4,
                    height: 4,
                    background: i === presentIndex ? '#00ff64' : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'width 0.2s, background 0.2s',
                  }}
                />
              ))}
            </div>

            {/* Notes */}
            {notes[slides[presentIndex]?.id] && (
              <div
                style={{
                  flex: 1,
                  fontFamily: '"Saans", sans-serif',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {notes[slides[presentIndex].id]}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main editor UI ── */}
      <div
        className="no-print"
        style={{
          display: 'grid',
          gridTemplateRows: '52px 1fr 120px 48px',
          gridTemplateColumns: '200px 1fr 280px',
          gridTemplateAreas: `
            "topbar topbar topbar"
            "rail canvas panel"
            "rail notes panel"
            "rail bottombar panel"
          `,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: '#1a1a1a',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            gridArea: 'topbar',
            background: '#111111',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            height: 52,
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <AirOpsLogo color="#008c44" width={72} />
            <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />
            <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 14, fontWeight: 500, color: '#F8FFFA' }}>
              SlideGen
            </div>
          </div>

          <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}>
            {activeIndex + 1} / {slides.length}
          </div>

          {/* ▶ Present button */}
          <button
            onClick={startPresentation}
            style={{
              background: theme.accent,
              border: 'none',
              color: theme.darkBg,
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '7px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#00ff64')}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1L9 6L1 11V1Z" fill="currentColor" />
            </svg>
            Present
          </button>

          <div style={{ width: 1, height: 20, background: '#2a2a2a' }} />

          {hasSavedDeck && (
            <button
              onClick={handleRestoreSaved}
              title="Swap with your previous deck"
              style={{
                background: 'transparent', border: '1px solid #2a2a2a',
                color: 'rgba(255,255,255,0.4)', fontFamily: '"Saans", sans-serif',
                fontSize: 13, cursor: 'pointer', padding: '5px 12px',
                transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              ↩ Previous
            </button>
          )}

          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: 'rgba(255,255,255,0.5)', fontFamily: '"Saans", sans-serif',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '5px 12px',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            ✦ New deck
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: '#F8FFFA', fontFamily: '"Saans", sans-serif',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '5px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#F8FFFA'; }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Slide
          </button>

          <button
            onClick={handleGoogleSlides}
            disabled={!!exportProgress}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: exportProgress ? 'rgba(255,255,255,0.3)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: exportProgress ? 'default' : 'pointer', padding: '5px 12px',
              transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!exportProgress) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = exportProgress ? 'rgba(255,255,255,0.3)' : '#F8FFFA'; }}
          >
            {exportProgress ? `Exporting ${exportProgress.current}/${exportProgress.total}…` : '↗ Google Slides'}
          </button>

          <button
            onClick={async () => {
              if (exportProgress) return;
              setExportProgress({ current: 0, total: slides.length });
              try {
                const { exportToPdf } = await import('@/lib/exportPdf');
                await exportToPdf(
                  slides,
                  (s, interactive) => renderSlide(s, interactive, undefined, getSlideTheme(s)),
                  (current, total) => setExportProgress({ current, total }),
                );
              } catch (err) {
                console.error(err);
              } finally {
                setExportProgress(null);
              }
            }}
            disabled={!!exportProgress}
            style={{
              background: exportProgress ? '#005c2d' : '#008c44',
              border: `1px solid ${exportProgress ? '#005c2d' : '#008c44'}`,
              color: 'white',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: exportProgress ? 'default' : 'pointer', padding: '5px 14px', transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!exportProgress) { (e.currentTarget as HTMLButtonElement).style.background = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#002910'; } }}
            onMouseLeave={(e) => { if (!exportProgress) { (e.currentTarget as HTMLButtonElement).style.background = '#008c44'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#008c44'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; } }}
          >
            {exportProgress ? `PDF ${exportProgress.current}/${exportProgress.total}…` : '↓ Export PDF'}
          </button>
        </div>

        {/* Thumbnail rail */}
        <div style={{ gridArea: 'rail', overflow: 'hidden' }}>
          <ThumbnailRail
            slides={slides}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            onReorder={(newSlides) => {
              const activeId = slides[activeIndex]?.id;
              setSlides(newSlides);
              const newIdx = newSlides.findIndex((s) => s.id === activeId);
              if (newIdx >= 0) setActiveIndex(newIdx);
            }}
            theme={theme}
            slideColorOverrides={slideColorOverrides}
          />
        </div>

        {/* Main canvas */}
        <div
          ref={canvasContainerRef}
          style={{
            gridArea: 'canvas', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#1a1a1a', overflow: 'hidden', position: 'relative',
          }}
        >
          {activeSlide && (
            <div style={{ width: slideWidth, height: slideHeight, position: 'relative', flexShrink: 0, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ transformOrigin: 'top left', transform: `scale(${canvasScale})`, width: 1280, height: 720, position: 'absolute', top: 0, left: 0 }}>
                {renderSlide(activeSlide, true, updateActiveSlide, activeSlideTheme)}
              </div>
            </div>
          )}
        </div>

        {/* Presenter notes */}
        <div
          style={{
            gridArea: 'notes',
            background: '#111111',
            borderTop: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'stretch',
            overflow: 'hidden',
          }}
        >
          {/* Label */}
          <div
            style={{
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              borderRight: '1px solid #2a2a2a',
            }}
          >
            <div
              style={{
                fontFamily: '"Saans Mono", monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Notes
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={notesRef}
            value={activeNote}
            onChange={(e) => {
              if (!activeSlide) return;
              setNotes((prev) => ({ ...prev, [activeSlide.id]: e.target.value }));
            }}
            placeholder="Add presenter notes for this slide…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              padding: '14px 20px',
              caretColor: '#00ff64',
            }}
          />

          {/* Notes indicator dot */}
          {activeNote && (
            <div
              style={{
                width: 6,
                height: 6,
                background: '#00ff64',
                borderRadius: '50%',
                position: 'absolute',
                // Will be overlaid on thumbnail — handled in ThumbnailRail ideally
                // Here just show inline with notes label
                alignSelf: 'flex-start',
                margin: '14px 12px',
              }}
            />
          )}
        </div>

        {/* Edit panel */}
        <div style={{ gridArea: 'panel', overflow: 'hidden' }}>
          {activeSlide && (
            <EditPanel
              slide={activeSlide}
              onChange={updateSlide}
              colorMode={colorMode}
              onColorModeChange={setColorMode}
              slideColorMode={slideColorOverrides[activeSlide.id]}
              onSlideColorModeChange={(mode) => {
                setSlideColorOverrides((prev) => {
                  const next = { ...prev };
                  if (mode === undefined) delete next[activeSlide.id];
                  else next[activeSlide.id] = mode;
                  return next;
                });
              }}
            />
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            gridArea: 'bottombar', background: '#111111', borderTop: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 48, gap: 16, flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13,
              cursor: activeIndex === 0 ? 'default' : 'pointer', padding: '5px 14px',
            }}
            onMouseEnter={(e) => { if (activeIndex > 0) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#F8FFFA'; }}
          >
            ← Prev
          </button>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  all: 'unset', width: i === activeIndex ? 16 : 6, height: 6,
                  background: i === activeIndex ? '#00ff64' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', transition: 'width 0.2s, background 0.2s',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={activeIndex === slides.length - 1}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: activeIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13,
              cursor: activeIndex === slides.length - 1 ? 'default' : 'pointer', padding: '5px 14px',
            }}
            onMouseEnter={(e) => { if (activeIndex < slides.length - 1) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = activeIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : '#F8FFFA'; }}
          >
            Next →
          </button>
        </div>
      </div>

      {showAddModal && <AddSlideModal onAdd={addSlide} onClose={() => setShowAddModal(false)} />}

      {/* Google setup modal */}
      {googleSetupNeeded && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, fontFamily: '"Saans", sans-serif' }} onClick={() => setGoogleSetupNeeded(false)}>
          <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: 40, width: 520, maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: '"Serrif VF", serif', fontSize: 24, color: '#ffffff', marginBottom: 8 }}>Connect Google Slides</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 24 }}>Add a Google OAuth Client ID to enable one-click export into Google Slides.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {[
                ['1', 'Go to', 'console.cloud.google.com/apis/credentials'],
                ['2', 'Click', '+ Create Credentials → OAuth client ID'],
                ['3', 'Type:', 'Web application'],
                ['4', 'Add authorized origin:', 'https://slide-gen-phi.vercel.app'],
                ['5', 'Run:', 'vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID'],
              ].map(([num, label, code]) => (
                <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, color: '#008c44', minWidth: 18, paddingTop: 2 }}>{num}.</div>
                  <div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{label} </span>
                    <code style={{ fontFamily: '"Saans Mono", monospace', fontSize: 12, color: '#00ff64', background: 'rgba(0,255,100,0.06)', padding: '2px 6px' }}>{code}</code>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setGoogleSetupNeeded(false)} style={{ background: '#008c44', border: 'none', color: 'white', fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '8px 20px' }}>Got it</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-output { display: block !important; }
          .slide-for-print { page-break-after: always; display: block; }
          .slide-for-print:last-child { page-break-after: avoid; }
        }
      `}</style>
    </>
  );
}
