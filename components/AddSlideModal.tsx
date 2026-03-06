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
  { type: 'hero', label: 'Hero' },
  { type: 'agenda', label: 'Agenda' },
  { type: 'quote', label: 'Quote' },
  { type: 'big-quote', label: 'Big Quote' },
  { type: 'three-col', label: '3 Columns' },
  { type: 'feature-list', label: 'Feature List' },
  { type: 'customer-story', label: 'Customer Story' },
  { type: 'checklist', label: 'Checklist' },
  { type: 'two-col-media', label: '2 Col + Media' },
  { type: 'contact', label: 'Contact' },
  { type: 'team', label: 'Team' },
  { type: 'full-image', label: 'Full Image' },
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
          width: 520,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px',
            borderBottom: '1px solid #2a2a2a',
            flexShrink: 0,
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

        {/* Scrollable list of slide types */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 0' }}>
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
                  alignItems: 'center',
                  gap: 16,
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 28px',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                {/* Preview thumbnail */}
                <div
                  style={{
                    width: 160,
                    height: THUMB_HEIGHT,
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #2a2a2a',
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
                    fontFamily: '"Saans", sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#F8FFFA',
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
