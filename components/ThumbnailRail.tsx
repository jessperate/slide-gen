'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SlideData } from '@/lib/slides';
import { SlideTheme, ColorMode, THEMES, DEFAULT_THEME } from '@/lib/themes';
import { renderSlide } from './SlideCanvas';

const THUMB_SCALE = 200 / 1280;
const THUMB_WIDTH = 200;
const THUMB_HEIGHT = Math.round(720 * THUMB_SCALE);

interface Props {
  slides: SlideData[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onReorder: (newSlides: SlideData[]) => void;
  onDelete: (index: number) => void;
  theme?: SlideTheme;
  slideColorOverrides?: Record<string, ColorMode>;
}

interface ThumbProps {
  slide: SlideData;
  index: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  slideTheme: SlideTheme;
  hasOverride: boolean;
  canDelete: boolean;
}

function SortableThumb({ slide, index, activeIndex, onSelect, onDelete, slideTheme, hasOverride, canDelete }: ThumbProps) {
  const [hovered, setHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      onClick={() => onSelect(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: 'block',
          padding: '6px 12px',
          background: 'transparent',
          width: '100%',
          boxSizing: 'border-box',
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
            color: activeIndex === index ? slideTheme.accent : 'rgba(255,255,255,0.3)',
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {index + 1}
          {hasOverride && (
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: slideTheme.accent, flexShrink: 0, display: 'inline-block' }} />
          )}
          {hovered && !isDragging && (
            <>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>⠿</span>
              {canDelete && (
                <span
                  onMouseDown={(e) => { e.stopPropagation(); onDelete(index); }}
                  style={{ color: 'rgba(255,80,80,0.7)', fontSize: 11, cursor: 'pointer', lineHeight: 1, padding: '0 2px' }}
                  title="Delete slide"
                >
                  ✕
                </span>
              )}
            </>
          )}
        </div>

        {/* Thumbnail frame */}
        <div
          style={{
            width: THUMB_WIDTH - 24,
            height: THUMB_HEIGHT,
            position: 'relative',
            overflow: 'hidden',
            outline: activeIndex === index
              ? `2px solid ${slideTheme.accent}`
              : '1px solid rgba(255,255,255,0.1)',
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
            {renderSlide(slide, false, undefined, slideTheme)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThumbnailRail({ slides, activeIndex, onSelect, onReorder, onDelete, theme = DEFAULT_THEME, slideColorOverrides = {} }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      onReorder(arrayMove(slides, oldIndex, newIndex));
    }
  };

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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {slides.map((slide, i) => {
            const slideTheme = THEMES[slideColorOverrides[slide.id] ?? theme.id] ?? theme;
            const hasOverride = !!slideColorOverrides[slide.id] && slideColorOverrides[slide.id] !== theme.id;
            return (
              <SortableThumb
                key={slide.id}
                slide={slide}
                index={i}
                activeIndex={activeIndex}
                onSelect={onSelect}
                onDelete={onDelete}
                slideTheme={slideTheme}
                hasOverride={hasOverride}
                canDelete={slides.length > 1}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
