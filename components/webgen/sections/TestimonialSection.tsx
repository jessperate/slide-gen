'use client';

import { useRef, useState } from 'react';
import { TestimonialSection as TestimonialData } from '@/lib/webgen';

interface Props {
  data: TestimonialData;
  onChange: (updated: TestimonialData) => void;
}

export default function TestimonialSection({ data, onChange }: Props) {
  const update = (fields: Partial<TestimonialData>) => onChange({ ...data, ...fields });
  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [stippling, setStippling] = useState(false);

  const handlePhotoUpload = async (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      update({ photoUrl: dataUrl, stippleUrl: undefined });
      // Auto-stipple
      await runStipple(dataUrl, file.type);
    };
    reader.readAsDataURL(file);
  };

  const runStipple = async (dataUrl: string, mimeType: string) => {
    setStippling(true);
    try {
      const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');
      const res = await fetch('/api/stipple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const result = await res.json();
      if (result.imageBase64) {
        const stippleDataUrl = `data:${result.mimeType || 'image/png'};base64,${result.imageBase64}`;
        update({ stippleUrl: stippleDataUrl });
      }
    } catch {
      // Stipple failed silently — original photo stays
    } finally {
      setStippling(false);
    }
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => update({ logoUrl: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const nameParts = data.personName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Use stippled version if available, fallback to original photo
  const displayPhoto = data.stippleUrl || data.photoUrl;

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
          {/* Name — serif first + sans last */}
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
              color: '#002910',
              background: '#eef9f3',
              padding: '5px 10px',
              display: 'inline-block',
              marginBottom: 16,
            }}
          >
            {data.title}
          </div>

          {/* Logo upload area */}
          <div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)} />
            {data.logoUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <img src={data.logoUrl} alt="Logo" style={{ height: 28, maxWidth: 140, objectFit: 'contain' }} />
                <button
                  onClick={() => update({ logoUrl: undefined })}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontSize: 12, cursor: 'pointer', padding: '2px 4px' }}
                >
                  &#10005;
                </button>
                <button
                  onClick={() => logoRef.current?.click()}
                  style={{ background: 'transparent', border: 'none', color: '#008c44', fontSize: 11, cursor: 'pointer', fontFamily: '"Saans", sans-serif' }}
                >
                  Replace
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoRef.current?.click()}
                style={{
                  background: 'transparent', border: '1px dashed #d4e8da',
                  color: '#008c44', fontFamily: '"Saans Mono", monospace',
                  fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                  padding: '6px 12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <i className="ri-building-line" style={{ fontSize: 12 }} /> Upload logo
              </button>
            )}
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
              color: '#002910',
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

      {/* Right: photo area */}
      <div
        style={{
          width: 520,
          background: displayPhoto ? '#f0f5f2' : '#001408',
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
          ref={photoRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
        />

        {displayPhoto ? (
          <>
            <img
              src={displayPhoto}
              alt={data.personName}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                // If stippled, show as-is; if original, apply B&W
                filter: data.stippleUrl ? 'none' : 'grayscale(100%)',
                mixBlendMode: data.stippleUrl ? 'normal' : 'plus-lighter',
              }}
            />
            {/* Stipple loading overlay */}
            {stippling && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,41,16,0.85)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 24, height: 24,
                  border: '2px solid rgba(0,255,100,0.3)',
                  borderTopColor: '#00ff64',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{
                  fontFamily: '"Saans Mono", monospace', fontSize: 11,
                  color: 'rgba(0,255,100,0.7)', letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}>
                  Creating stipple...
                </span>
              </div>
            )}
            {/* Controls overlay on hover */}
            <div
              onClick={() => photoRef.current?.click()}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, opacity: 0, transition: 'opacity 0.2s',
                color: 'white', fontFamily: '"Saans", sans-serif', fontSize: 13,
              }}
              onMouseEnter={(e) => { if (!stippling) e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            >
              <i className="ri-image-edit-line" style={{ fontSize: 24 }} />
              Replace photo
              {data.stippleUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); update({ stippleUrl: undefined }); }}
                  style={{
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white', fontSize: 11, padding: '4px 12px', cursor: 'pointer',
                    fontFamily: '"Saans", sans-serif', marginTop: 4,
                  }}
                >
                  Use original photo
                </button>
              )}
              {!data.stippleUrl && data.photoUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); runStipple(data.photoUrl!, 'image/jpeg'); }}
                  style={{
                    background: 'rgba(0,255,100,0.2)', border: '1px solid rgba(0,255,100,0.4)',
                    color: '#00ff64', fontSize: 11, padding: '4px 12px', cursor: 'pointer',
                    fontFamily: '"Saans", sans-serif', marginTop: 4,
                  }}
                >
                  Re-stipple
                </button>
              )}
            </div>
          </>
        ) : (
          <div
            onClick={() => photoRef.current?.click()}
            style={{
              color: 'rgba(255,255,255,0.3)', fontFamily: '"Saans", sans-serif',
              fontSize: 13, textAlign: 'center', cursor: 'pointer',
            }}
          >
            <i className="ri-user-line" style={{ fontSize: 36, display: 'block', marginBottom: 8, opacity: 0.4 }} />
            Click to upload headshot
            <div style={{ fontSize: 10, marginTop: 6, color: 'rgba(255,255,255,0.2)', fontFamily: '"Saans Mono", monospace' }}>
              Auto-stippled via AI
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
