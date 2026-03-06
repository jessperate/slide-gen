'use client';

import { useState, useRef } from 'react';
import { TeamSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';
import { richTextProps } from '@/lib/richText';

interface Props {
  data: TeamSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<TeamSlideData>) => void;
  theme?: SlideTheme;
}

function MemberAvatar({
  member,
  avatarSize,
  theme,
  onUpload,
}: {
  member: { name: string; imageUrl?: string };
  avatarSize: number;
  theme: SlideTheme;
  onUpload?: (url: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      // Show original immediately while stipple processes
      onUpload?.(dataUrl);
      try {
        const res = await fetch('/api/stipple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
        });
        const data = await res.json();
        if (res.ok) onUpload?.(`data:${data.mimeType};base64,${data.imageBase64}`);
      } catch { /* keep original if stipple fails */ } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{ position: 'relative', width: avatarSize, height: avatarSize, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle */}
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${theme.stroke}`,
          background: theme.darkBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {member.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.imageUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ fontFamily: '"Serrif VF", serif', fontSize: avatarSize * 0.38, fontWeight: 400, color: theme.accent, lineHeight: 1 }}>
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Upload overlay (interactive only) */}
      {onUpload && (
        <>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading ? 'default' : 'pointer',
              opacity: hovered || loading ? 1 : 0.25,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <div style={{ color: '#00ff64', fontSize: 11, fontFamily: '"Saans Mono", monospace', textAlign: 'center', letterSpacing: '0.05em', padding: '0 8px' }}>
                ✦
              </div>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  const count = data.members.length;
  const avatarSize = count <= 4 ? 140 : 110;

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: theme.lightBg,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
        fontFamily: '"Saans", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Accent bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: theme.accent, zIndex: 10 }} />

      {/* AirOps logo bottom-left */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', bottom: 32, left: 48, zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnLight} width={80} />
        </div>
      )}

      {/* Headline */}
      {data.headline !== undefined && (
        <div
          {...richTextProps(data.headline ?? '', !!onUpdate, (html) => onUpdate?.({ ...data, headline: html }))}
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 40,
            fontWeight: 400,
            color: theme.textOnLight,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: 56,
            outline: 'none',
            cursor: onUpdate ? 'text' : 'default',
          }}
        />
      )}

      {/* Team grid */}
      <div
        style={{
          display: 'flex',
          gap: count <= 4 ? 48 : 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 1100,
        }}
      >
        {data.members.map((member, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* Avatar */}
            <MemberAvatar
              member={member}
              avatarSize={avatarSize}
              theme={theme}
              onUpload={onUpdate ? (url) => {
                const members = [...data.members];
                members[i] = { ...members[i], imageUrl: url };
                onUpdate({ ...data, members });
              } : undefined}
            />

            {/* Name */}
            <div
              {...richTextProps(member.name ?? '', !!onUpdate, (html) => {
                const members = [...data.members];
                members[i] = { ...members[i], name: html };
                onUpdate?.({ ...data, members });
              })}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: theme.textOnLight,
                textAlign: 'center',
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />

            {/* Role */}
            <div
              {...richTextProps(member.role ?? '', !!onUpdate, (html) => {
                const members = [...data.members];
                members[i] = { ...members[i], role: html };
                onUpdate?.({ ...data, members });
              })}
              style={{
                fontFamily: '"Saans Mono", monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.mutedOnLight,
                textAlign: 'center',
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
