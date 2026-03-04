'use client';

import { useRef, useEffect, useState } from 'react';
import { SlideData } from '@/lib/slides';
import CoverSlide from './slides/CoverSlide';
import SectionSlide from './slides/SectionSlide';
import DiagramSlide from './slides/DiagramSlide';
import StatsSlide from './slides/StatsSlide';
import ContentSlide from './slides/ContentSlide';
import BackCoverSlide from './slides/BackCoverSlide';

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
