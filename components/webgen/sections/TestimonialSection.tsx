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

  // Split name into first (serif) and last (sans)
  const nameParts = data.personName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <section
      style={{
        background: 'linear-gradient(to top, #f8fffa, #fefffe)',
        padding: '168px 48px 48px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section headline */}
        <div style={{ marginBottom: 48, maxWidth: 600 }}>
          <div style={{
            fontFamily: '"Serrif VF", Georgia, serif',
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-2.16px',
            color: '#002910',
          }}>
            What our
          </div>
          <div style={{
            fontFamily: '"Saans", "Inter", sans-serif',
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: '-2.16px',
            color: '#002910',
          }}>
            customers say.
          </div>
        </div>

        {/* Card */}
        <div style={{
          display: 'flex',
          border: '1px solid #005e1f',
          borderWidth: '1px 0',
          minHeight: 500,
        }}>
          {/* Left: content */}
          <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Name — serif + sans */}
              <div style={{ marginBottom: 16 }}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => update({ personName: (e.currentTarget.textContent || '') + (lastName ? ` ${lastName}` : '') })}
                  style={{
                    fontFamily: '"Serrif VF", Georgia, serif',
                    fontSize: 72,
                    fontWeight: 400,
                    lineHeight: 0.84,
                    letterSpacing: '-2.88px',
                    color: '#002910',
                    display: 'inline',
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
                      fontSize: 72,
                      fontWeight: 400,
                      lineHeight: 0.84,
                      letterSpacing: '-2.88px',
                      color: '#002910',
                    }}
                  >
                    {lastName}
                  </div>
                )}
              </div>

              {/* Title badge */}
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => update({ title: e.currentTarget.textContent || '' })}
                style={{
                  fontFamily: '"DM Mono", "Saans Mono", monospace',
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: '0.7px',
                  color: '#000',
                  background: '#eef9f3',
                  padding: '6px 12px',
                  display: 'inline-block',
                  marginBottom: 32,
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
                  fontSize: 32,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: '#009b32',
                  marginBottom: 24,
                }}
              >
                &ldquo;{data.quote}&rdquo;
              </div>

              {data.stat && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{
                    fontFamily: '"Serrif VF", Georgia, serif',
                    fontSize: 48,
                    fontWeight: 400,
                    color: '#002910',
                  }}>
                    {data.stat.value}
                  </span>
                  <span style={{
                    fontFamily: '"Saans", "Inter", sans-serif',
                    fontSize: 16,
                    color: '#3a4a3e',
                  }}>
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
              flex: 1,
              background: '#001408',
              position: 'relative',
              cursor: 'pointer',
              minHeight: 400,
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
              onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
            />
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.personName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)',
                  mixBlendMode: 'plus-lighter',
                }}
              />
            ) : (
              <div style={{
                color: 'rgba(255,255,255,0.3)',
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.4 }}>
                  <i className="ri-user-line" />
                </div>
                Click to upload photo
              </div>
            )}
            {/* Hover overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s',
              color: 'white',
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            >
              Click to {data.photoUrl ? 'replace' : 'upload'} photo
            </div>
          </div>
        </div>

        {/* Logo bar */}
        {data.companyLogo && (
          <div style={{
            height: 89,
            background: '#f8fffb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #002910',
          }}>
            <img
              src={`https://logo.clearbit.com/${data.companyLogo}`}
              alt=""
              style={{ height: 32, opacity: 0.6 }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
      </div>
    </section>
  );
}
