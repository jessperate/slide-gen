'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  fieldKey: string;
  currentScale: number;
  anchorRect: DOMRect;
  onScale: (newScale: number) => void;
  onClose: () => void;
}

const STEP = 0.15;
const MIN = 0.5;
const MAX = 2.5;

export default function FloatingFontSizer({ currentScale, anchorRect, onScale, onClose }: Props) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const top = Math.max(8, anchorRect.top - 44);
  const left = anchorRect.left + anchorRect.width / 2;
  const isDefault = Math.abs(currentScale - 1) < 0.05;

  const toolbar = (
    <div
      ref={toolbarRef}
      data-font-sizer="true"
      onMouseDown={(e) => e.preventDefault()} // prevent blur on contentEditable
      style={{
        position: 'fixed',
        top,
        left,
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        background: '#1a1a1a',
        border: '1px solid #333',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        padding: '3px 4px',
        animation: 'fontSizerIn 0.12s ease',
      }}
    >
      <button
        onClick={() => onScale(Math.max(MIN, Math.round((currentScale - STEP) * 100) / 100))}
        title="Decrease font size"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          fontSize: 13,
          padding: '3px 7px',
          lineHeight: 1,
          fontFamily: '"Saans", sans-serif',
          transition: 'color 0.1s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
      >
        A<span style={{ fontSize: 9, verticalAlign: 'sub' }}>−</span>
      </button>

      <div
        style={{
          width: 1,
          height: 16,
          background: '#333',
          flexShrink: 0,
        }}
      />

      <button
        onClick={() => onScale(isDefault ? 1 : 1)}
        title={isDefault ? 'Default size' : 'Reset to default'}
        style={{
          background: 'transparent',
          border: 'none',
          color: isDefault ? 'rgba(0,255,100,0.6)' : 'rgba(255,255,255,0.4)',
          cursor: isDefault ? 'default' : 'pointer',
          fontSize: 10,
          padding: '3px 6px',
          lineHeight: 1,
          fontFamily: '"Saans Mono", monospace',
          letterSpacing: '0.03em',
          minWidth: 36,
          textAlign: 'center',
          transition: 'color 0.1s',
        }}
        onMouseEnter={(e) => { if (!isDefault) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = isDefault ? 'rgba(0,255,100,0.6)' : 'rgba(255,255,255,0.4)'; }}
      >
        {isDefault ? '1×' : `${currentScale.toFixed(2).replace(/\.?0+$/, '')}×`}
      </button>

      <div
        style={{
          width: 1,
          height: 16,
          background: '#333',
          flexShrink: 0,
        }}
      />

      <button
        onClick={() => onScale(Math.min(MAX, Math.round((currentScale + STEP) * 100) / 100))}
        title="Increase font size"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          fontSize: 17,
          padding: '3px 7px',
          lineHeight: 1,
          fontFamily: '"Saans", sans-serif',
          transition: 'color 0.1s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
      >
        A
      </button>

      <style>{`
        @keyframes fontSizerIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(toolbar, document.body) : null;
}
