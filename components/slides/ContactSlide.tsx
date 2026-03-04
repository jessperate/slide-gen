'use client';

import { ContactSlideData } from '@/lib/slides';
import { SlideTheme, DEFAULT_THEME } from '@/lib/themes';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  data: ContactSlideData;
  interactive?: boolean;
  onUpdate?: (updates: Partial<ContactSlideData>) => void;
  theme?: SlideTheme;
}

export default function ContactSlide({ data, interactive = true, onUpdate, theme = DEFAULT_THEME }: Props) {
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: theme.darkBg,
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

      {/* AirOps logo top-center */}
      {!data.hideLogo && (
        <div style={{ position: 'absolute', top: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <AirOpsLogo color={theme.logoOnDark} width={80} />
        </div>
      )}

      {/* Headline */}
      <div
        contentEditable={!!onUpdate}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...data, headline: e.currentTarget.textContent ?? '' })}
        style={{
          fontFamily: '"Serrif VF", serif',
          fontSize: 52,
          fontWeight: 400,
          color: theme.textOnDark,
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

      {/* Contact cards */}
      <div style={{ display: 'flex', gap: 24 }}>
        {data.cards.map((card, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${theme.stroke}`,
              padding: '40px 48px',
              minWidth: 340,
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {/* Name */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const cards = [...data.cards];
                cards[i] = { ...cards[i], name: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, cards });
              }}
              style={{
                fontFamily: '"Serrif VF", serif',
                fontSize: 28,
                fontWeight: 400,
                color: theme.textOnDark,
                letterSpacing: '-0.01em',
                marginBottom: 6,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {card.name}
            </div>

            {/* Role */}
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => {
                const cards = [...data.cards];
                cards[i] = { ...cards[i], role: e.currentTarget.textContent ?? '' };
                onUpdate?.({ ...data, cards });
              }}
              style={{
                fontFamily: '"Saans", sans-serif',
                fontSize: 13,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 28,
                outline: 'none',
                cursor: onUpdate ? 'text' : 'default',
              }}
            >
              {card.role}
            </div>

            {/* Divider */}
            <div style={{ width: '100%', height: 1, background: theme.stroke, marginBottom: 24 }} />

            {/* Contact rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {card.linkedin && (
                <ContactRow
                  icon="in"
                  value={card.linkedin}
                  theme={theme}
                  editable={!!onUpdate}
                  onEdit={(v) => {
                    const cards = [...data.cards];
                    cards[i] = { ...cards[i], linkedin: v };
                    onUpdate?.({ ...data, cards });
                  }}
                />
              )}
              {card.email && (
                <ContactRow
                  icon="@"
                  value={card.email}
                  theme={theme}
                  editable={!!onUpdate}
                  onEdit={(v) => {
                    const cards = [...data.cards];
                    cards[i] = { ...cards[i], email: v };
                    onUpdate?.({ ...data, cards });
                  }}
                />
              )}
              {card.website && (
                <ContactRow
                  icon="↗"
                  value={card.website}
                  theme={theme}
                  editable={!!onUpdate}
                  onEdit={(v) => {
                    const cards = [...data.cards];
                    cards[i] = { ...cards[i], website: v };
                    onUpdate?.({ ...data, cards });
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  value,
  theme,
  editable,
  onEdit,
}: {
  icon: string;
  value: string;
  theme: SlideTheme;
  editable: boolean;
  onEdit: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 28,
          height: 28,
          background: theme.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: '"Saans Mono", monospace',
          fontSize: 10,
          fontWeight: 700,
          color: theme.darkBg,
        }}
      >
        {icon}
      </div>
      <div
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={(e) => onEdit(e.currentTarget.textContent ?? '')}
        style={{
          fontFamily: '"Saans", sans-serif',
          fontSize: 14,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.65)',
          outline: 'none',
          cursor: editable ? 'text' : 'default',
          flex: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
