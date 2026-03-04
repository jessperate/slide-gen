'use client';

import { SlideData, defaultSlideByType } from '@/lib/slides';
import { renderSlide } from './SlideCanvas';

const THUMB_SCALE = 160 / 1280;
const THUMB_HEIGHT = Math.round(720 * THUMB_SCALE);

interface Props {
  onAdd: (slide: SlideData) => void;
  onClose: () => void;
}

const slideTypes = [
  { type: 'cover', label: 'Cover' },
  { type: 'section', label: 'Section' },
  { type: 'diagram', label: 'Diagram' },
  { type: 'stats', label: 'Stats' },
  { type: 'content', label: 'Content' },
  { type: 'back-cover', label: 'Back Cover' },
] as const;

export default function AddSlideModal({ onAdd, onClose }: Props) {
  const handleAdd = (type: string) => {
    const template = defaultSlideByType[type];
    if (!template) return;
    const newSlide: SlideData = {
      ...template,
      id: Date.now().toString(),
    };
    onAdd(newSlide);
    onClose();
  };

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: 0,
          padding: 32,
          width: 720,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Saans Mono", monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 4,
              }}
            >
              Add Slide
            </div>
            <div
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 18,
                fontWeight: 500,
                color: '#F8FFFA',
              }}
            >
              Choose a slide type
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #2a2a2a',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 0,
            }}
          >
            Cancel
          </button>
        </div>

        {/* Grid of slide types — 3 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {slideTypes.map(({ type, label }) => {
            const template = defaultSlideByType[type];
            if (!template) return null;
            return (
              <button
                key={type}
                onClick={() => handleAdd(type)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Preview thumbnail */}
                <div
                  style={{
                    width: '100%',
                    height: THUMB_HEIGHT,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #2a2a2a',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#00ff64';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a';
                  }}
                >
                  <div
                    style={{
                      transformOrigin: 'top left',
                      transform: `scale(${THUMB_SCALE})`,
                      width: 1280,
                      height: 720,
                      pointerEvents: 'none',
                    }}
                  >
                    {renderSlide(template, false)}
                  </div>
                </div>
                {/* Label */}
                <div
                  style={{
                    fontFamily: '"Saans Mono", monospace',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                  }}
                >
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
