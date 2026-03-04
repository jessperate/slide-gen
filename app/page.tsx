'use client';

import { useState, useRef, useEffect } from 'react';
import { SlideData, defaultSlides } from '@/lib/slides';
import ThumbnailRail from '@/components/ThumbnailRail';
import EditPanel from '@/components/EditPanel';
import AddSlideModal from '@/components/AddSlideModal';
import { renderSlide } from '@/components/SlideCanvas';

export default function SlideGenPage() {
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const activeSlide = slides[activeIndex];

  // Compute canvas scale from container size
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const padding = 48;
      const availW = width - padding * 2;
      const availH = height - padding * 2;
      const scaleX = availW / 1280;
      const scaleY = availH / 720;
      setCanvasScale(Math.min(scaleX, scaleY, 1));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const updateSlide = (updated: SlideData) => {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const updateActiveSlide = (updates: Partial<SlideData>) => {
    setSlides((prev) =>
      prev.map((s, i) =>
        i === activeIndex ? ({ ...s, ...updates } as SlideData) : s,
      ),
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

  const handlePrev = () => {
    setActiveIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setActiveIndex((i) => Math.min(slides.length - 1, i + 1));
  };

  const handleExport = () => {
    window.print();
  };

  const slideWidth = Math.round(1280 * canvasScale);
  const slideHeight = Math.round(720 * canvasScale);

  return (
    <>
      {/* Print output (hidden in screen, shown in print) */}
      <div style={{ display: 'none' }} className="print-output">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide-for-print"
            style={{ width: 1280, height: 720, position: 'relative', overflow: 'hidden' }}
          >
            {renderSlide(slide, false)}
          </div>
        ))}
      </div>

      {/* Main editor UI */}
      <div
        className="no-print"
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateColumns: '200px 1fr 280px',
          gridTemplateAreas: `
            "topbar topbar topbar"
            "rail canvas panel"
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
            gap: 16,
            flexShrink: 0,
          }}
        >
          {/* Logo / title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: 18,
                fontWeight: 400,
                color: '#008c44',
                letterSpacing: '-0.01em',
              }}
            >
              AirOps
            </div>
            <div
              style={{
                width: 1,
                height: 16,
                background: '#2a2a2a',
              }}
            />
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: '#F8FFFA',
              }}
            >
              SlideGen
            </div>
          </div>

          {/* Slide counter */}
          <div
            style={{
              fontFamily: '"Saans Mono", monospace',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {activeIndex + 1} of {slides.length}
          </div>

          {/* Add Slide button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'transparent',
              border: '1px solid #2a2a2a',
              color: '#F8FFFA',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64';
              (e.currentTarget as HTMLButtonElement).style.color = '#00ff64';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a';
              (e.currentTarget as HTMLButtonElement).style.color = '#F8FFFA';
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Add Slide
          </button>

          {/* Export button */}
          <button
            onClick={handleExport}
            style={{
              background: '#008c44',
              border: '1px solid #008c44',
              color: 'white',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#00ff64';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64';
              (e.currentTarget as HTMLButtonElement).style.color = '#002910';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#008c44';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#008c44';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
          >
            Export
          </button>
        </div>

        {/* Thumbnail rail */}
        <div style={{ gridArea: 'rail', overflow: 'hidden' }}>
          <ThumbnailRail
            slides={slides}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>

        {/* Main canvas */}
        <div
          ref={canvasContainerRef}
          style={{
            gridArea: 'canvas',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1a1a',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {activeSlide && (
            <div
              style={{
                width: slideWidth,
                height: slideHeight,
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  transformOrigin: 'top left',
                  transform: `scale(${canvasScale})`,
                  width: 1280,
                  height: 720,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {renderSlide(activeSlide, true, updateActiveSlide)}
              </div>
            </div>
          )}
        </div>

        {/* Edit panel */}
        <div style={{ gridArea: 'panel', overflow: 'hidden' }}>
          {activeSlide && (
            <EditPanel slide={activeSlide} onChange={updateSlide} />
          )}
        </div>

        {/* Bottom bar with prev/next */}
        <div
          style={{
            gridArea: 'bottombar',
            background: '#111111',
            borderTop: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            gap: 16,
            flexShrink: 0,
          }}
        >
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            style={{
              background: 'transparent',
              border: '1px solid #2a2a2a',
              color: activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: activeIndex === 0 ? 'default' : 'pointer',
              padding: '6px 16px',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeIndex > 0) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64';
                (e.currentTarget as HTMLButtonElement).style.color = '#00ff64';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a';
              (e.currentTarget as HTMLButtonElement).style.color =
                activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#F8FFFA';
            }}
          >
            ← Prev
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  all: 'unset',
                  width: i === activeIndex ? 16 : 6,
                  height: 6,
                  background: i === activeIndex ? '#00ff64' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'width 0.2s, background 0.2s',
                  borderRadius: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === slides.length - 1}
            style={{
              background: 'transparent',
              border: '1px solid #2a2a2a',
              color: activeIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: activeIndex === slides.length - 1 ? 'default' : 'pointer',
              padding: '6px 16px',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeIndex < slides.length - 1) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64';
                (e.currentTarget as HTMLButtonElement).style.color = '#00ff64';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a';
              (e.currentTarget as HTMLButtonElement).style.color =
                activeIndex === slides.length - 1
                  ? 'rgba(255,255,255,0.2)'
                  : '#F8FFFA';
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Add Slide Modal */}
      {showAddModal && (
        <AddSlideModal
          onAdd={addSlide}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Global print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-output { display: block !important; }
          .slide-for-print {
            page-break-after: always;
            display: block;
          }
          .slide-for-print:last-child {
            page-break-after: avoid;
          }
        }
      `}</style>
    </>
  );
}
