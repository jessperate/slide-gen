'use client';

import { useRef, useEffect, useState } from 'react';
import { SlideData, LogoOverlay, ImageOverlay, FrameOverlay } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import CoverSlide from './slides/CoverSlide';
import SectionSlide from './slides/SectionSlide';
import DiagramSlide from './slides/DiagramSlide';
import StatsSlide from './slides/StatsSlide';
import ContentSlide from './slides/ContentSlide';
import BackCoverSlide from './slides/BackCoverSlide';
import HeroSlide from './slides/HeroSlide';
import AgendaSlide from './slides/AgendaSlide';
import QuoteSlide from './slides/QuoteSlide';
import ThreeColSlide from './slides/ThreeColSlide';
import FeatureListSlide from './slides/FeatureListSlide';
import CustomerStorySlide from './slides/CustomerStorySlide';
import ChecklistSlide from './slides/ChecklistSlide';
import BigQuoteSlide from './slides/BigQuoteSlide';
import TwoColMediaSlide from './slides/TwoColMediaSlide';
import ContactSlide from './slides/ContactSlide';
import TeamSlide from './slides/TeamSlide';
import FullImageSlide from './slides/FullImageSlide';
import TableSlide from './slides/TableSlide';
import ChartSlide from './slides/ChartSlide';
import CaseStudySlide from './slides/CaseStudySlide';
import SpeakerSlide from './slides/SpeakerSlide';

interface Props {
  slide: SlideData;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onUpdate?: (updates: Partial<SlideData>) => void;
  theme?: SlideTheme;
}

export function renderSlide(
  slide: SlideData,
  interactive: boolean = true,
  onUpdate?: (updates: Partial<SlideData>) => void,
  theme: SlideTheme = DEFAULT_THEME,
): React.ReactElement | null {
  switch (slide.type) {
    case 'cover':
      return (
        <CoverSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'section':
      return (
        <SectionSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'diagram':
      return (
        <DiagramSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'stats':
      return (
        <StatsSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'content':
      return (
        <ContentSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'back-cover':
      return (
        <BackCoverSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'hero':
      return (
        <HeroSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'agenda':
      return (
        <AgendaSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'quote':
      return (
        <QuoteSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'three-col':
      return (
        <ThreeColSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'feature-list':
      return (
        <FeatureListSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'customer-story':
      return (
        <CustomerStorySlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'checklist':
      return (
        <ChecklistSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'big-quote':
      return (
        <BigQuoteSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'two-col-media':
      return (
        <TwoColMediaSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'contact':
      return (
        <ContactSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'team':
      return (
        <TeamSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'full-image':
      return (
        <FullImageSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'table':
      return (
        <TableSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'chart':
      return (
        <ChartSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'case-study':
      return (
        <CaseStudySlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    case 'speaker':
      return (
        <SpeakerSlide
          data={slide}
          interactive={interactive}
          onUpdate={onUpdate as ((updates: Partial<typeof slide>) => void) | undefined}
          theme={theme}
        />
      );
    default:
      return null;
  }
}

export function LogoLayer({
  logos,
  scale,
  interactive,
  onUpdate,
}: {
  logos: LogoOverlay[];
  scale: number;
  interactive: boolean;
  onUpdate?: (logos: LogoOverlay[]) => void;
}) {
  const [localLogos, setLocalLogos] = useState(logos);
  const localLogosRef = useRef(logos);
  const isDragging = useRef(false);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  // Sync from parent only when not actively dragging
  useEffect(() => {
    if (!isDragging.current) {
      localLogosRef.current = logos;
      setLocalLogos(logos);
    }
  }, [logos]);

  const handleMouseDown = (e: React.MouseEvent, logo: LogoOverlay) => {
    if (!interactive || !onUpdateRef.current) return;
    e.preventDefault();

    isDragging.current = true;
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startX = logo.x;
    const startY = logo.y;
    const id = logo.id;
    const capturedScale = scale;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = (me.clientX - startClientX) / capturedScale;
      const dy = (me.clientY - startClientY) / capturedScale;
      const newX = Math.max(0, Math.min(100, startX + (dx / 1280) * 100));
      const newY = Math.max(0, Math.min(100, startY + (dy / 720) * 100));
      const updated = localLogosRef.current.map((l) =>
        l.id === id ? { ...l, x: newX, y: newY } : l
      );
      localLogosRef.current = updated;
      setLocalLogos([...updated]);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      onUpdateRef.current?.(localLogosRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (localLogos.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      {localLogos.map((logo) => (
        <div
          key={logo.id}
          onMouseDown={(e) => handleMouseDown(e, logo)}
          style={{
            position: 'absolute',
            left: (logo.x / 100) * 1280,
            top: (logo.y / 100) * 720,
            transform: 'translate(-50%, -50%)',
            cursor: interactive ? 'grab' : 'default',
            userSelect: 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.brandfetch.io/${logo.domain}/w/400/h/120`}
            alt={logo.domain}
            draggable={false}
            style={{ width: logo.width, height: 'auto', display: 'block', pointerEvents: 'none', filter: logo.grayscale ? 'grayscale(1)' : 'none' }}
          />
        </div>
      ))}
    </div>
  );
}

export function ImageOverlayLayer({
  overlays,
  scale,
  interactive,
  onUpdate,
}: {
  overlays: ImageOverlay[];
  scale: number;
  interactive: boolean;
  onUpdate?: (overlays: ImageOverlay[]) => void;
}) {
  const [localOverlays, setLocalOverlays] = useState(overlays);
  const localOverlaysRef = useRef(overlays);
  const onUpdateRef = useRef(onUpdate);
  // hoveredId tracks which overlay the mouse is over; kept during active drag
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeDragId = useRef<string | null>(null);

  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  useEffect(() => {
    if (!activeDragId.current) {
      localOverlaysRef.current = overlays;
      setLocalOverlays(overlays);
    }
  }, [overlays]);

  const startDrag = (
    e: React.MouseEvent,
    overlay: ImageOverlay,
    mode: 'move' | 'tl' | 'tr' | 'bl' | 'br'
  ) => {
    if (!interactive || !onUpdateRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    activeDragId.current = overlay.id;

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startX = overlay.x;
    const startY = overlay.y;
    const startW = overlay.width;
    const startH = overlay.height;
    const id = overlay.id;
    const capturedScale = scale;
    const dxSign = mode === 'tr' || mode === 'br' ? 1 : mode === 'tl' || mode === 'bl' ? -1 : 0;
    const dySign = mode === 'bl' || mode === 'br' ? 1 : mode === 'tl' || mode === 'tr' ? -1 : 0;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = (me.clientX - startClientX) / capturedScale;
      const dy = (me.clientY - startClientY) / capturedScale;

      let newX = startX, newY = startY, newW = startW, newH = startH;

      if (mode === 'move') {
        newX = Math.max(0, Math.min(100, startX + (dx / 1280) * 100));
        newY = Math.max(0, Math.min(100, startY + (dy / 720) * 100));
      } else {
        newW = Math.max(40, startW + dxSign * dx);
        newH = Math.max(40, startH + dySign * dy);
        newX = startX + (dxSign * (newW - startW)) / 2 / 1280 * 100;
        newY = startY + (dySign * (newH - startH)) / 2 / 720 * 100;
      }

      const updated = localOverlaysRef.current.map((o) =>
        o.id === id ? { ...o, x: newX, y: newY, width: newW, height: newH } : o
      );
      localOverlaysRef.current = updated;
      setLocalOverlays([...updated]);
    };

    const handleMouseUp = () => {
      activeDragId.current = null;
      onUpdateRef.current?.(localOverlaysRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = localOverlaysRef.current.filter((o) => o.id !== id);
    localOverlaysRef.current = updated;
    setLocalOverlays([...updated]);
    onUpdateRef.current?.(updated);
    setHoveredId(null);
  };

  if (localOverlays.length === 0) return null;

  const PAD = 16; // padding around image so corner handles stay inside the hover zone

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none' }}>
      {localOverlays.map((overlay) => {
        const showHandles = interactive && hoveredId === overlay.id;
        return (
          // Outer hover zone: larger than the image by PAD on each side so handles stay inside it
          <div
            key={overlay.id}
            onMouseEnter={() => interactive && setHoveredId(overlay.id)}
            onMouseLeave={() => { if (!activeDragId.current) setHoveredId(null); }}
            style={{
              position: 'absolute',
              left: (overlay.x / 100) * 1280,
              top: (overlay.y / 100) * 720,
              width: overlay.width + PAD * 2,
              height: overlay.height + PAD * 2,
              transform: 'translate(-50%, -50%)',
              pointerEvents: interactive ? 'auto' : 'none',
              userSelect: 'none',
            }}
          >
            {/* Inner image div, inset by PAD */}
            <div
              onMouseDown={(e) => startDrag(e, overlay, 'move')}
              style={{
                position: 'absolute',
                left: PAD,
                top: PAD,
                width: overlay.width,
                height: overlay.height,
                cursor: interactive ? 'grab' : 'default',
                outline: showHandles ? '2px solid #00ff64' : 'none',
                outlineOffset: 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={overlay.url}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block', pointerEvents: 'none' }}
              />
            </div>
            {showHandles && (
              <>
                {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
                  <div
                    key={corner}
                    onMouseDown={(e) => startDrag(e, overlay, corner)}
                    style={{
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      background: '#00ff64',
                      border: '1.5px solid #002910',
                      boxSizing: 'border-box',
                      // Positioned at image corners (PAD offset from outer div edges)
                      ...(corner === 'tl' ? { top: PAD - 6, left: PAD - 6, cursor: 'nw-resize' } :
                          corner === 'tr' ? { top: PAD - 6, left: PAD + overlay.width - 6, cursor: 'ne-resize' } :
                          corner === 'bl' ? { top: PAD + overlay.height - 6, left: PAD - 6, cursor: 'sw-resize' } :
                                           { top: PAD + overlay.height - 6, left: PAD + overlay.width - 6, cursor: 'se-resize' }),
                    }}
                  />
                ))}
                <div
                  onMouseDown={(e) => handleDelete(e, overlay.id)}
                  style={{
                    position: 'absolute',
                    top: PAD - 10,
                    left: PAD + overlay.width - 10,
                    width: 20,
                    height: 20,
                    background: '#cc3333',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  ✕
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

const FRAME_TITLE_H = 28; // px height of the drag-handle title bar

export function FrameOverlayLayer({
  overlays,
  scale,
  interactive,
  onUpdate,
}: {
  overlays: FrameOverlay[];
  scale: number;
  interactive: boolean;
  onUpdate?: (overlays: FrameOverlay[]) => void;
}) {
  const [localOverlays, setLocalOverlays] = useState(overlays);
  const localOverlaysRef = useRef(overlays);
  const onUpdateRef = useRef(onUpdate);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  useEffect(() => {
    if (!isDraggingActive) {
      localOverlaysRef.current = overlays;
      setLocalOverlays(overlays);
    }
  }, [overlays, isDraggingActive]);

  const handleDragMouseDown = (e: React.MouseEvent, overlay: FrameOverlay) => {
    if (!interactive || !onUpdateRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingActive(true);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startX = overlay.x;
    const startY = overlay.y;
    const id = overlay.id;
    const capturedScale = scale;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = (me.clientX - startClientX) / capturedScale;
      const dy = (me.clientY - startClientY) / capturedScale;
      const newX = Math.max(0, Math.min(100, startX + (dx / 1280) * 100));
      const newY = Math.max(0, Math.min(100, startY + (dy / 720) * 100));
      const updated = localOverlaysRef.current.map((o) =>
        o.id === id ? { ...o, x: newX, y: newY } : o
      );
      localOverlaysRef.current = updated;
      setLocalOverlays([...updated]);
    };

    const handleMouseUp = () => {
      setIsDraggingActive(false);
      onUpdateRef.current?.(localOverlaysRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    overlay: FrameOverlay,
    corner: 'tl' | 'tr' | 'bl' | 'br'
  ) => {
    if (!interactive || !onUpdateRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingActive(true);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startW = overlay.width;
    const startH = overlay.height;
    const startX = overlay.x;
    const startY = overlay.y;
    const id = overlay.id;
    const capturedScale = scale;
    const dxSign = corner === 'tr' || corner === 'br' ? 1 : -1;
    const dySign = corner === 'bl' || corner === 'br' ? 1 : -1;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = (me.clientX - startClientX) / capturedScale;
      const dy = (me.clientY - startClientY) / capturedScale;
      const newW = Math.max(120, startW + dxSign * dx);
      const newH = Math.max(80, startH + dySign * dy);
      const newX = startX + (dxSign * (newW - startW)) / 2 / 1280 * 100;
      const newY = startY + (dySign * (newH - startH)) / 2 / 720 * 100;
      const updated = localOverlaysRef.current.map((o) =>
        o.id === id ? { ...o, width: newW, height: newH, x: newX, y: newY } : o
      );
      localOverlaysRef.current = updated;
      setLocalOverlays([...updated]);
    };

    const handleMouseUp = () => {
      setIsDraggingActive(false);
      onUpdateRef.current?.(localOverlaysRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = localOverlaysRef.current.filter((o) => o.id !== id);
    localOverlaysRef.current = updated;
    setLocalOverlays([...updated]);
    onUpdateRef.current?.(updated);
  };

  if (localOverlays.length === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
      {/* Full-slide drag blocker shown during active drag/resize so mouse moves over iframes are captured */}
      {isDraggingActive && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100 }} />
      )}
      {localOverlays.map((overlay) => {
        let hostname = overlay.url;
        try { hostname = new URL(overlay.url).hostname; } catch {}
        return (
          <div
            key={overlay.id}
            style={{
              position: 'absolute',
              left: (overlay.x / 100) * 1280,
              top: (overlay.y / 100) * 720,
              width: overlay.width,
              height: overlay.height,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: interactive ? 'auto' : 'none',
              border: '1px solid #2a2a2a',
              background: '#fff',
              userSelect: 'none',
            }}
          >
            {/* Title bar — drag handle */}
            <div
              onMouseDown={(e) => handleDragMouseDown(e, overlay)}
              style={{
                height: FRAME_TITLE_H,
                background: '#1a1a1a',
                borderBottom: '1px solid #2a2a2a',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 8px',
                cursor: interactive ? 'grab' : 'default',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: '"Saans Mono", monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {hostname}
              </span>
              {interactive && (
                <button
                  onMouseDown={(e) => handleDelete(e, overlay.id)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11, padding: '2px 4px', lineHeight: 1, flexShrink: 0 }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* iframe */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <iframe
                src={overlay.url}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>

            {/* Corner resize handles */}
            {interactive && (['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
              <div
                key={corner}
                onMouseDown={(e) => handleResizeMouseDown(e, overlay, corner)}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  background: '#00ff64',
                  border: '1.5px solid #002910',
                  boxSizing: 'border-box',
                  zIndex: 10,
                  ...(corner === 'tl' ? { top: -5, left: -5, cursor: 'nw-resize' } :
                      corner === 'tr' ? { top: -5, right: -5, cursor: 'ne-resize' } :
                      corner === 'bl' ? { bottom: -5, left: -5, cursor: 'sw-resize' } :
                                       { bottom: -5, right: -5, cursor: 'se-resize' }),
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function SlideCanvas({ slide, interactive = true, className, style, onUpdate, theme = DEFAULT_THEME }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const scaleX = width / 1280;
      const scaleY = height / 720;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const logos = (slide as { logos?: LogoOverlay[] }).logos ?? [];
  const imageOverlays = (slide as { imageOverlays?: ImageOverlay[] }).imageOverlays ?? [];
  const frameOverlays = (slide as { frameOverlays?: FrameOverlay[] }).frameOverlays ?? [];

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          width: 1280,
          height: 720,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {renderSlide(slide, interactive, onUpdate, theme)}
        <LogoLayer
          logos={logos}
          scale={scale}
          interactive={interactive}
          onUpdate={
            onUpdate
              ? (updatedLogos) => onUpdate({ logos: updatedLogos } as Partial<SlideData>)
              : undefined
          }
        />
        <ImageOverlayLayer
          overlays={imageOverlays}
          scale={scale}
          interactive={interactive}
          onUpdate={
            onUpdate
              ? (updatedOverlays) => onUpdate({ imageOverlays: updatedOverlays } as Partial<SlideData>)
              : undefined
          }
        />
        <FrameOverlayLayer
          overlays={frameOverlays}
          scale={scale}
          interactive={interactive}
          onUpdate={
            onUpdate
              ? (updatedOverlays) => onUpdate({ frameOverlays: updatedOverlays } as Partial<SlideData>)
              : undefined
          }
        />
      </div>
    </div>
  );
}
