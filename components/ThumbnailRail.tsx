'use client';

import { SlideData } from '@/lib/slides';
import { renderSlide } from './SlideCanvas';

const THUMB_SCALE = 200 / 1280;
const THUMB_WIDTH = 200;
const THUMB_HEIGHT = Math.round(720 * THUMB_SCALE);

interface Props {
  slides: SlideData[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ThumbnailRail({ slides, activeIndex, onSelect }: Props) {
  return (
    <div
      className="no-print"
      style={{
        width: 200,
        height: '100%',
        overflowY: 'auto',
        background: '#111111',
        borderRight: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        padding: '12px 0',
        flexShrink: 0,
      }}
    >
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          onClick={() => onSelect(i)}
          style={{
            all: 'unset',
            display: 'block',
            cursor: 'pointer',
            padding: '6px 12px',
            background: 'transparent',
          }}
        >
          {/* Slide number */}
          <div
            style={{
              fontFamily: '"Saans Mono", monospace',
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeIndex === i ? '#00ff64' : 'rgba(255,255,255,0.3)',
              marginBottom: 4,
            }}
          >
            {i + 1}
          </div>

          {/* Thumbnail frame */}
          <div
            style={{
              width: THUMB_WIDTH - 24,
              height: THUMB_HEIGHT,
              position: 'relative',
              overflow: 'hidden',
              outline: activeIndex === i
                ? '2px solid #00ff64'
                : '1px solid rgba(255,255,255,0.1)',
              outlineOffset: activeIndex === i ? 0 : 0,
              transition: 'outline-color 0.15s ease',
            }}
          >
            <div
              style={{
                transformOrigin: 'top left',
                transform: `scale(${(THUMB_WIDTH - 24) / 1280})`,
                width: 1280,
                height: 720,
                pointerEvents: 'none',
              }}
            >
              {renderSlide(slide, false)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
