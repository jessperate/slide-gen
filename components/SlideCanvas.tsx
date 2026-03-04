'use client';

import { useRef, useEffect, useState } from 'react';
import { SlideData, LogoOverlay } from '@/lib/slides';
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
  const localLogosRef = useRef(logos);
  const [displayLogos, setDisplayLogos] = useState(logos);

  useEffect(() => {
    localLogosRef.current = logos;
    setDisplayLogos(logos);
  }, [logos]);

  const handleMouseDown = (e: React.MouseEvent, logo: LogoOverlay) => {
    if (!interactive || !onUpdate) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startLogoX = logo.x;
    const startLogoY = logo.y;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = (me.clientX - startX) / scale;
      const dy = (me.clientY - startY) / scale;
      const newX = Math.max(0, Math.min(100, startLogoX + (dx / 1280) * 100));
      const newY = Math.max(0, Math.min(100, startLogoY + (dy / 720) * 100));
      const updated = localLogosRef.current.map((l) =>
        l.id === logo.id ? { ...l, x: newX, y: newY } : l
      );
      localLogosRef.current = updated;
      setDisplayLogos([...updated]);
    };

    const handleMouseUp = () => {
      onUpdate(localLogosRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (displayLogos.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      {displayLogos.map((logo) => (
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
            style={{ width: logo.width, height: 'auto', display: 'block' }}
          />
        </div>
      ))}
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
      </div>
    </div>
  );
}
