'use client';

import { FeatureListSlideData } from '@/lib/slides';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: FeatureListSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<FeatureListSlideData>) => void;
}

export default function FeatureListSlide({ data, interactive = true, onUpdate }: Props) {
  const items = data.items.slice(0, 5);

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
      }}
    >
      {/* AirOps logo bottom-right */}
      <div style={{ position: 'absolute', bottom: 36, right: 64 }}>
        <AirOpsLogo color="#001408" width={80} />
      </div>

      {/* Green bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#00ff64' }} />

      {/* Headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          position: 'absolute',
          top: 48,
          left: 64,
          fontFamily: '"Saans", sans-serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#000d05',
          outline: 'none',
          cursor: onUpdate ? 'text' : 'default',
          borderRadius: 2,
        }}
      >
        {data.headline}
      </div>

      {/* Items */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 64,
          right: 64,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              height: 96,
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #d4e8da',
              gap: 0,
            }}
          >
            {/* Icon */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.items];
                next[i] = { ...next[i], icon: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                fontSize: 28,
                color: '#008c44',
                width: 40,
                flexShrink: 0,
                lineHeight: 1,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {item.icon}
            </div>

            {/* Title */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.items];
                next[i] = { ...next[i], title: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#000d05',
                width: 220,
                flexShrink: 0,
                marginLeft: 16,
                lineHeight: 1.3,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {item.title}
            </div>

            {/* Body */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...data.items];
                next[i] = { ...next[i], body: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, items: next });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                fontWeight: 400,
                color: '#676c79',
                lineHeight: 1.5,
                flex: 1,
                marginLeft: 24,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
                borderRadius: 2,
              }}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
