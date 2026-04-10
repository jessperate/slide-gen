'use client';

import { useRef } from 'react';
import { ContentImageSection as ContentImageData } from '@/lib/webgen';

interface Props {
  data: ContentImageData;
  onChange: (updated: ContentImageData) => void;
}

export default function ContentImageSection({ data, onChange }: Props) {
  const update = (fields: Partial<ContentImageData>) => onChange({ ...data, ...fields });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => update({ imageUrl: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#ffffff',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left: text content */}
      <div style={{
        width: 560,
        padding: '64px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {/* Eyebrow */}
        {data.eyebrow !== undefined && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ eyebrow: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Saans Mono", "DM Mono", monospace',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.84px',
              color: '#008c44',
              marginBottom: 24,
              lineHeight: 1.3,
            }}
          >
            {data.eyebrow}
          </div>
        )}

        {/* Headline */}
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ headline: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Serrif VF", Georgia, serif',
            fontSize: 44,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-1.32px',
            color: '#002910',
            marginBottom: 24,
          }}
        >
          {data.headline}
        </div>

        {/* Accent rule */}
        <div style={{
          width: 40,
          height: 3,
          background: '#008c44',
          marginBottom: 24,
        }} />

        {/* Body */}
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update({ body: e.currentTarget.textContent || '' })}
          style={{
            fontFamily: '"Saans", "Inter", sans-serif',
            fontSize: 18,
            lineHeight: 1.6,
            color: '#3a4a3e',
          }}
        >
          {data.body}
        </div>

        {/* Optional CTA */}
        {data.ctaLabel && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ ctaLabel: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Saans", "Inter", sans-serif',
              fontSize: 18,
              fontWeight: 500,
              color: '#01200d',
              marginTop: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'text',
            }}
          >
            {data.ctaLabel} <i className="ri-arrow-right-line" style={{ fontSize: 18 }} />
          </div>
        )}
      </div>

      {/* Right: image */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          flex: 1,
          background: data.imageUrl ? 'transparent' : '#00250e',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
        />

        {data.imageUrl ? (
          <>
            <img
              src={data.imageUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Replace overlay */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s',
                color: 'white', fontFamily: '"Saans", sans-serif', fontSize: 13,
                flexDirection: 'column', gap: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            >
              <i className="ri-image-edit-line" style={{ fontSize: 24 }} />
              Replace image
            </div>
          </>
        ) : (
          <div style={{
            color: 'rgba(255,255,255,0.3)',
            fontFamily: '"Saans", sans-serif',
            fontSize: 13,
            textAlign: 'center',
          }}>
            <i className="ri-image-add-line" style={{ fontSize: 36, display: 'block', marginBottom: 8, opacity: 0.4 }} />
            Click to add image
          </div>
        )}

        {/* Edge gradient blend from left content area */}
        {data.imageUrl && (
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 60,
            background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
}
