'use client';

import { TeamSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: TeamSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<TeamSlideData>) => void;
  theme?: SlideTheme;
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
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
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
        >
          {data.headline}
        </div>
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
            {member.imageUrl ? (
              <div
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${theme.stroke}`,
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: '50%',
                  background: theme.darkBg,
                  border: `2px solid ${theme.stroke}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: '"Serrif VF", serif',
                    fontSize: avatarSize * 0.38,
                    fontWeight: 400,
                    color: theme.accent,
                    lineHeight: 1,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Name */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const members = [...data.members];
                members[i] = { ...members[i], name: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, members });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: theme.textOnLight,
                textAlign: 'center',
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {member.name}
            </div>

            {/* Role */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const members = [...data.members];
                members[i] = { ...members[i], role: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, members });
              }}
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
            >
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
