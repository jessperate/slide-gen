'use client';

import { useState, useEffect } from 'react';
import { SlideData } from '@/lib/slides';
import { ColorMode, THEMES, DEFAULT_THEME } from '@/lib/themes';
import { DeckEntry, loadHistory, removeFromHistory, formatRelativeDate } from '@/lib/deckHistory';
import { renderSlide } from '@/components/SlideCanvas';

const THUMB_W = 240;
const THUMB_H = Math.round(720 * (THUMB_W / 1280));
const THUMB_SCALE = THUMB_W / 1280;

interface Props {
  currentDeckId: string;
  onLoad: (entry: DeckEntry) => void;
  onClose: () => void;
}

function DeckThumb({ slides, colorMode, slideColorOverrides }: { slides: SlideData[]; colorMode: ColorMode; slideColorOverrides: Record<string, ColorMode> }) {
  const first = slides[0];
  if (!first) return <div style={{ width: THUMB_W, height: THUMB_H, background: '#1a1a1a' }} />;
  const slideColorMode = slideColorOverrides[first.id] ?? colorMode;
  const theme = THEMES[slideColorMode] ?? DEFAULT_THEME;
  return (
    <div style={{ width: THUMB_W, height: THUMB_H, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ transformOrigin: 'top left', transform: `scale(${THUMB_SCALE})`, width: 1280, height: 720, position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {renderSlide(first, false, undefined, theme)}
      </div>
    </div>
  );
}

export default function RecentDecksModal({ currentDeckId, onLoad, onClose }: Props) {
  const [history, setHistory] = useState<DeckEntry[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromHistory(id);
    setHistory((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111', border: '1px solid #2a2a2a', borderRadius: 12,
          width: 800, maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 15, fontWeight: 600, color: '#F8FFFA' }}>
            Recent Decks
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#666', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Deck list */}
        <div style={{ overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {history.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: 40,
              color: 'rgba(255,255,255,0.3)', fontFamily: '"Saans", sans-serif', fontSize: 14,
            }}>
              No saved decks yet. Keep working and they'll appear here.
            </div>
          )}
          {history.map((entry) => {
            const isCurrent = entry.id === currentDeckId;
            const isHovered = hoveredId === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => onLoad(entry)}
                onMouseEnter={() => setHoveredId(entry.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
                  border: `1px solid ${isCurrent ? '#008c44' : isHovered ? '#444' : '#2a2a2a'}`,
                  transition: 'border-color 0.15s',
                  position: 'relative',
                  background: '#1a1a1a',
                }}
              >
                {/* Thumbnail */}
                <DeckThumb slides={entry.slides} colorMode={entry.colorMode} slideColorOverrides={entry.slideColorOverrides} />

                {/* Info */}
                <div style={{ padding: '10px 12px', borderTop: '1px solid #2a2a2a' }}>
                  <div style={{
                    fontFamily: '"Saans", sans-serif', fontSize: 12, fontWeight: 500,
                    color: '#F8FFFA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: 4,
                  }}>
                    {entry.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                      {formatRelativeDate(entry.lastModified)}
                      {isCurrent && <span style={{ marginLeft: 6, color: '#008c44' }}>• current</span>}
                    </div>
                    <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                      {entry.slides.length} slide{entry.slides.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                {isHovered && (
                  <button
                    onClick={(e) => handleDelete(e, entry.id)}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      background: 'rgba(0,0,0,0.7)', border: '1px solid #444',
                      borderRadius: 4, color: '#888', fontSize: 11, cursor: 'pointer',
                      padding: '2px 6px', fontFamily: '"Saans", sans-serif',
                      lineHeight: 1.4,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
