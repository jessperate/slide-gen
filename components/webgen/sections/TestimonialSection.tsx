'use client';

import { useRef } from 'react';
import { TestimonialSection as TestimonialData } from '@/lib/webgen';

interface Props {
  data: TestimonialData;
  onChange: (updated: TestimonialData) => void;
}

export default function TestimonialSection({ data, onChange }: Props) {
  const update = (fields: Partial<TestimonialData>) => onChange({ ...data, ...fields });
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => update({ photoUrl: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const nameParts = data.personName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: 'linear-gradient(to top, #f8fffa, #fefffe)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left: content */}
      <div style={{
        flex: 1,
        padding: '56px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update({ personName: (e.currentTarget.textContent || '') + (lastName ? ` ${lastName}` : '') })}
              style={{
                fontFamily: '"Serrif VF", Georgia, serif',
                fontSize: 64,
                fontWeight: 400,
                lineHeight: 0.9,
                letterSpacing: '-2.56px',
                color: '#002910',
              }}
            >
              {firstName}
            </div>
            {lastName && (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => update({ personName: firstName + ' ' + (e.currentTarget.textContent || '') })}
                style={{
                  fontFamily: '"Saans", "Inter", sans-serif',
                  fontSize: 64,
                  fontWeight: 400,
                  lineHeight: 0.9,
                  letterSpacing: '-2.56px',
                  color: '#002910',
                }}
              >
                {lastName}
              </div>
            )}
          </div>

          {/* Title */}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ title: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"DM Mono", "Saans Mono", monospace',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.65px',
              color: '#000',
              background: '#eef9f3',
              padding: '5px 10px',
              display: 'inline-block',
              marginBottom: 20,
            }}
          >
            {data.title}
          </div>
        </div>

        {/* Quote */}
        <div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update({ quote: e.currentTarget.textContent || '' })}
            style={{
              fontFamily: '"Serrif VF", Georgia, serif',
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.25,
              color: '#009b32',
              marginBottom: 20,
            }}
          >
            &ldquo;{data.quote}&rdquo;
          </div>

          {data.stat && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: '"Serrif VF", Georgia, serif', fontSize: 40, color: '#002910' }}>
                {data.stat.value}
              </span>
              <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 14, color: '#3a4a3e' }}>
                {data.stat.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right: photo */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: 520,
          background: '#001408',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
        />
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={data.personName}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%)',
              mixBlendMode: 'plus-lighter',
            }}
          />
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontFamily: '"Saans", sans-serif', fontSize: 13, textAlign: 'center' }}>
            <i className="ri-user-line" style={{ fontSize: 36, display: 'block', marginBottom: 8, opacity: 0.4 }} />
            Click to upload photo
          </div>
        )}
      </div>
    </div>
  );
}
