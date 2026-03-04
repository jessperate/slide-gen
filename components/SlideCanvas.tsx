'use client';

import { useRef, useEffect, useState } from 'react';
import { SlideData } from '@/lib/slides';
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

interface Props {
  slide: SlideData;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function renderSlide(slide: SlideData, interactive: boolean = true) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide data={slide} interactive={interactive} />;
    case 'section':
      return <SectionSlide data={slide} interactive={interactive} />;
    case 'diagram':
      return <DiagramSlide data={slide} interactive={interactive} />;
    case 'stats':
      return <StatsSlide data={slide} interactive={interactive} />;
    case 'content':
      return <ContentSlide data={slide} interactive={interactive} />;
    case 'back-cover':
      return <BackCoverSlide data={slide} interactive={interactive} />;
    case 'hero':
      return <HeroSlide data={slide} interactive={interactive} />;
    case 'agenda':
      return <AgendaSlide data={slide} interactive={interactive} />;
    case 'quote':
      return <QuoteSlide data={slide} interactive={interactive} />;
    case 'three-col':
      return <ThreeColSlide data={slide} interactive={interactive} />;
    case 'feature-list':
      return <FeatureListSlide data={slide} interactive={interactive} />;
    case 'customer-story':
      return <CustomerStorySlide data={slide} interactive={interactive} />;
    case 'checklist':
      return <ChecklistSlide data={slide} interactive={interactive} />;
    default:
      return null;
  }
}

export default function SlideCanvas({ slide, interactive = true, className, style }: Props) {
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
        }}
      >
        {renderSlide(slide, interactive)}
      </div>
    </div>
  );
}
