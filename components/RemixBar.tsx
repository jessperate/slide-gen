'use client';

import { useState } from 'react';
import { SlideData } from '@/lib/slides';
import { remixToType, REMIX_OPTIONS } from '@/lib/remixLayout';

const W = 88;
const H = 52;

// Accent / fill values
const G = '#00ff64';          // green
const GA = 'rgba(0,255,100,0.55)';
const GB = 'rgba(0,255,100,0.2)';
const W1 = 'rgba(255,255,255,0.55)';
const W2 = 'rgba(255,255,255,0.3)';
const W3 = 'rgba(255,255,255,0.14)';
const B1 = 'rgba(255,255,255,0.07)';

function Schematic({ type, hovered }: { type: string; hovered: boolean }) {
  const a = hovered ? G : GA;
  const ab = hovered ? 'rgba(0,255,100,0.3)' : GB;

  switch (type) {
    case 'cover':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#001a0a" />
          <rect x={8} y={8} width={28} height={2} rx={1} fill={W3} />
          <rect x={8} y={13} width={52} height={7} rx={1} fill={W1} />
          <rect x={8} y={22} width={40} height={6} rx={1} fill={W2} />
          <rect x={8} y={31} width={22} height={2} rx={1} fill={W3} />
          <text x={68} y={38} fontSize={22} fill={ab} fontFamily="serif" textAnchor="middle">Aa</text>
          <rect x={0} y={H - 5} width={W} height={5} fill={a} />
        </svg>
      );

    case 'section':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#001a0a" />
          <text x={8} y={28} fontSize={28} fill={ab} fontFamily="serif" fontWeight="bold">01</text>
          <rect x={8} y={32} width={60} height={6} rx={1} fill={W1} />
          <rect x={8} y={40} width={40} height={3} rx={1} fill={W2} />
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'two-col-media':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          {/* Text column */}
          <rect x={6} y={8} width={36} height={3} rx={1} fill={W2} />
          <rect x={6} y={14} width={34} height={6} rx={1} fill={W1} />
          <rect x={6} y={23} width={28} height={2.5} rx={1} fill={W2} />
          <rect x={6} y={27} width={22} height={2.5} rx={1} fill={W3} />
          {/* Image column */}
          <rect x={47} y={5} width={35} height={38} rx={2} fill={ab} />
          <text x={64} y={29} fontSize={18} fill="rgba(0,255,100,0.6)" textAnchor="middle">⬚</text>
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'quote':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <text x={7} y={20} fontSize={26} fill={a} fontFamily="Georgia,serif">"</text>
          <rect x={18} y={10} width={58} height={4} rx={1} fill={W1} />
          <rect x={8} y={16} width={68} height={3.5} rx={1} fill={W2} />
          <rect x={8} y={21} width={54} height={3.5} rx={1} fill={W2} />
          <rect x={8} y={28} width={30} height={2.5} rx={1} fill={W3} />
          <rect x={8} y={35} width={16} height={2} rx={1} fill={W3} />
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'big-quote':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#001a0a" />
          <text x={5} y={28} fontSize={36} fill={ab} fontFamily="Georgia,serif" opacity={0.8}>"</text>
          <rect x={8} y={20} width={72} height={5} rx={1} fill={W1} />
          <rect x={8} y={27} width={64} height={5} rx={1} fill={W1} />
          <rect x={8} y={35} width={40} height={5} rx={1} fill={W2} />
          <rect x={8} y={43} width={22} height={2.5} rx={1} fill={W3} />
          <rect x={0} y={H - 3} width={W} height={3} fill={a} />
        </svg>
      );

    case 'three-col': {
      const icons = ['◆', '↗', '✦'];
      const cols = [{ x: 6 }, { x: 33 }, { x: 60 }];
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={5} width={60} height={3} rx={1} fill={W2} />
          {cols.map((c, i) => (
            <g key={i}>
              <rect x={c.x} y={11} width={22} height={14} rx={1.5} fill={B1} stroke={ab} strokeWidth={0.6} />
              <text x={c.x + 11} y={22} fontSize={10} fill={a} textAnchor="middle">{icons[i]}</text>
              <rect x={c.x} y={28} width={22} height={3} rx={1} fill={W2} />
              <rect x={c.x} y={33} width={18} height={2} rx={1} fill={W3} />
              <rect x={c.x} y={37} width={14} height={2} rx={1} fill={W3} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );
    }

    case 'feature-list': {
      const featureIcons = ['◆', '↗', '✦', '⊞'];
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={5} width={44} height={3} rx={1} fill={W2} />
          {featureIcons.map((icon, i) => (
            <g key={i}>
              <rect x={6} y={12 + i * 8} width={12} height={7} rx={1} fill={ab} />
              <text x={12} y={18 + i * 8} fontSize={7} fill="#002910" textAnchor="middle" fontWeight="bold">{icon}</text>
              <rect x={22} y={13 + i * 8} width={38} height={2.5} rx={1} fill={W2} />
              <rect x={22} y={17 + i * 8} width={28} height={2} rx={1} fill={W3} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );
    }

    case 'content':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={5} width={56} height={3} rx={1} fill={W2} />
          {[0, 1].map(i => (
            <g key={i}>
              <rect x={6 + i * 41} y={12} width={35} height={3} rx={1} fill={W1} />
              <rect x={6 + i * 41} y={17} width={35} height={2.5} rx={1} fill={W2} />
              <rect x={6 + i * 41} y={21} width={35} height={2.5} rx={1} fill={W3} />
              <rect x={6 + i * 41} y={25} width={28} height={2.5} rx={1} fill={W3} />
              <rect x={6 + i * 41} y={29} width={22} height={2.5} rx={1} fill={W3} />
            </g>
          ))}
          <line x1={46} y1={10} x2={46} y2={44} stroke={W3} strokeWidth={0.5} />
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'diagram': {
      const boxes = [{ x: 4 }, { x: 32 }, { x: 60 }];
      const icons2 = ['⬡', '⬡', '⬡'];
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={4} width={44} height={3} rx={1} fill={W2} />
          {boxes.map((b, i) => (
            <g key={i}>
              <rect x={b.x + 2} y={11} width={24} height={30} rx={2} fill={B1} stroke={W3} strokeWidth={0.5} />
              <rect x={b.x + 4} y={14} width={20} height={3} rx={1} fill={ab} />
              <rect x={b.x + 4} y={19} width={20} height={2} rx={1} fill={W3} />
              <rect x={b.x + 4} y={23} width={16} height={2} rx={1} fill={W3} />
              <text x={b.x + 14} y={34} fontSize={7} fill={W3} textAnchor="middle">{icons2[i]}</text>
              {i < 2 && <path d={`M${b.x + 26} 26 L${b.x + 32} 26`} stroke={a} strokeWidth={1.2} markerEnd="url(#arr)" />}
            </g>
          ))}
          <defs>
            <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
              <path d="M0,0 L4,2 L0,4 Z" fill={a} />
            </marker>
          </defs>
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );
    }

    case 'stats': {
      const statColors = [GB, 'rgba(0,200,255,0.2)', 'rgba(255,100,200,0.2)'];
      const statBorders = [ab, 'rgba(0,200,255,0.5)', 'rgba(255,100,200,0.5)'];
      const nums = ['3x', '40%', '10x'];
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0a0a0a" />
          <rect x={6} y={4} width={44} height={3} rx={1} fill={W2} />
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x={4 + i * 28} y={11} width={22} height={28} rx={2} fill={statColors[i]} stroke={statBorders[i]} strokeWidth={0.7} />
              <text x={15 + i * 28} y={27} fontSize={10} fill={statBorders[i]} textAnchor="middle" fontWeight="bold">{nums[i]}</text>
              <rect x={6 + i * 28} y={31} width={18} height={2} rx={1} fill={W3} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );
    }

    case 'customer-story':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={5} width={18} height={4} rx={1} fill={ab} />
          <rect x={6} y={13} width={46} height={4} rx={1} fill={W1} />
          <rect x={6} y={19} width={38} height={3} rx={1} fill={W2} />
          <rect x={6} y={24} width={32} height={3} rx={1} fill={W3} />
          {/* Metrics */}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x={56} y={5 + i * 14} width={26} height={11} rx={1.5} fill={B1} stroke={ab} strokeWidth={0.5} />
              <text x={69} y={13 + i * 14} fontSize={8} fill={a} textAnchor="middle" fontWeight="bold">{['37%', '15%', '36%'][i]}</text>
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'checklist': {
      const checks = [true, true, false, false];
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={4} width={44} height={3} rx={1} fill={W2} />
          {checks.map((checked, i) => (
            <g key={i}>
              <rect x={6} y={11 + i * 9} width={8} height={7} rx={1} fill={checked ? ab : B1} stroke={checked ? a : W3} strokeWidth={0.6} />
              {checked && <path d={`M${7.5} ${15.5 + i * 9} L${9.5} ${17.5 + i * 9} L${13} ${13 + i * 9}`} stroke="#002910" strokeWidth={1.2} fill="none" />}
              <rect x={18} y={12 + i * 9} width={52} height={2.5} rx={1} fill={checked ? W2 : W3} />
              <rect x={18} y={16 + i * 9} width={36} height={2} rx={1} fill={W3} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );
    }

    case 'agenda':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={18} y={4} width={52} height={4} rx={1} fill={W1} />
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <text x={10} y={17 + i * 7} fontSize={8} fill={a} textAnchor="middle">{i + 1}</text>
              <rect x={18} y={12 + i * 7} width={58} height={3} rx={1} fill={i === 0 ? W2 : W3} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'hero':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#001a0a" />
          <rect x={8} y={7} width={72} height={7} rx={1.5} fill={W1} />
          <rect x={16} y={16} width={56} height={4} rx={1} fill={W2} />
          <rect x={12} y={24} width={4} height={4} rx={0.5} fill={W3} />
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={18 + i * 14} y={24} width={10} height={4} rx={0.5} fill={W3} />
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'back-cover':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#001a0a" />
          <rect x={12} y={10} width={64} height={8} rx={1.5} fill={W1} />
          <rect x={16} y={20} width={56} height={4} rx={1} fill={W2} />
          <rect x={22} y={28} width={44} height={10} rx={2} fill="none" stroke={a} strokeWidth={1.2} />
          <text x={44} y={36} fontSize={8} fill={a} textAnchor="middle">Get started ↗</text>
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'team':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={16} y={4} width={56} height={3} rx={1} fill={W2} />
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <circle cx={12 + i * 21} cy={22} r={9} fill={B1} stroke={ab} strokeWidth={0.7} />
              <circle cx={12 + i * 21} cy={19} r={3.5} fill={W3} />
              <path d={`M${3 + i * 21} 30 Q${12 + i * 21} 24 ${21 + i * 21} 30`} fill={W3} />
              <rect x={5 + i * 21} y={34} width={16} height={2} rx={1} fill={W3} />
              <rect x={7 + i * 21} y={37.5} width={12} height={1.5} rx={0.5} fill={W3} opacity={0.5} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    case 'contact':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={16} y={4} width={56} height={3} rx={1} fill={W2} />
          {[0, 1].map(i => (
            <g key={i}>
              <rect x={5 + i * 44} y={10} width={38} height={32} rx={2} fill={B1} stroke={W3} strokeWidth={0.5} />
              <circle cx={24 + i * 44} cy={20} r={5} fill={W3} />
              <rect x={10 + i * 44} y={27} width={28} height={2} rx={1} fill={W2} />
              <rect x={14 + i * 44} y={31} width={20} height={1.5} rx={0.5} fill={W3} />
              <rect x={12 + i * 44} y={35} width={24} height={1.5} rx={0.5} fill={W3} opacity={0.5} />
            </g>
          ))}
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );

    default:
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect width={W} height={H} fill="#0d1a0f" />
          <rect x={6} y={6} width={76} height={36} rx={2} fill={B1} />
          <rect x={0} y={H - 4} width={W} height={4} fill={a} />
        </svg>
      );
  }
}

interface RemixBarProps {
  slide: SlideData;
  originalSlide?: SlideData;
  onRemix: (remixed: SlideData) => void;
  onRevert?: () => void;
}

export default function RemixBar({ slide, originalSlide, onRemix, onRevert }: RemixBarProps) {
  const options = REMIX_OPTIONS[slide.type] ?? [];
  const [hovered, setHovered] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  if (options.length === 0) return null;

  const handleRemix = async (targetType: string) => {
    if (loadingType) return;
    setLoadingType(targetType);
    try {
      const res = await fetch('/api/ai-remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slide, targetType }),
      });
      const data = await res.json();
      if (data.slide) onRemix(data.slide);
      else onRemix(remixToType(slide, targetType)); // fallback
    } catch {
      onRemix(remixToType(slide, targetType)); // fallback on network error
    } finally {
      setLoadingType(null);
    }
  };

  const btnBase: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid #2a2a2a',
    padding: '6px 8px 5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    transition: 'border-color 0.15s, background 0.15s',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(8,8,8,0.95)',
        border: '1px solid #2a2a2a',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
        overflowX: 'auto',
        maxWidth: '100%',
      }}
    >
      {/* Label */}
      <div style={{
        fontSize: 9,
        fontFamily: '"Saans Mono", monospace',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        whiteSpace: 'nowrap',
        paddingRight: 8,
        borderRight: '1px solid #2a2a2a',
        marginRight: 2,
        lineHeight: 1,
        flexShrink: 0,
      }}>
        Remix layout
      </div>

      {/* Revert to original */}
      {originalSlide && onRevert && (
        <>
          <button
            onClick={onRevert}
            onMouseEnter={() => setHovered('__original__')}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...btnBase,
              cursor: 'pointer',
              border: `1px solid ${hovered === '__original__' ? '#00ff64' : '#3a3a3a'}`,
              background: hovered === '__original__' ? 'rgba(0,255,100,0.08)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              <rect width={W} height={H} fill="#111" />
              <text x={44} y={24} fontSize={22} fill={hovered === '__original__' ? '#00ff64' : 'rgba(255,255,255,0.4)'} textAnchor="middle">↩</text>
              <rect x={16} y={32} width={56} height={2} rx={1} fill="rgba(255,255,255,0.1)" />
              <rect x={0} y={H - 4} width={W} height={4} fill={hovered === '__original__' ? '#00ff64' : 'rgba(255,255,255,0.1)'} />
            </svg>
            <span style={{ fontSize: 10, fontFamily: '"Saans", sans-serif', color: hovered === '__original__' ? '#00ff64' : 'rgba(255,255,255,0.4)' }}>
              Original
            </span>
          </button>
          <div style={{ width: 1, height: 40, background: '#2a2a2a', flexShrink: 0 }} />
        </>
      )}

      {/* Layout options */}
      {options.map((opt) => {
        const isLoading = loadingType === opt.type;
        const isDisabled = !!loadingType;
        return (
          <button
            key={opt.type}
            onClick={() => handleRemix(opt.type)}
            onMouseEnter={() => !isDisabled && setHovered(opt.type)}
            onMouseLeave={() => setHovered(null)}
            disabled={isDisabled}
            style={{
              ...btnBase,
              cursor: isDisabled ? 'default' : 'pointer',
              border: `1px solid ${hovered === opt.type ? 'rgba(0,255,100,0.5)' : '#252525'}`,
              background: isLoading ? 'rgba(0,255,100,0.08)' : hovered === opt.type ? 'rgba(0,255,100,0.06)' : 'transparent',
              opacity: isDisabled && !isLoading ? 0.4 : 1,
              position: 'relative',
            }}
          >
            {isLoading ? (
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                <rect width={W} height={H} fill="#0d1a0f" />
                <text x={44} y={30} fontSize={11} fill="rgba(0,255,100,0.7)" textAnchor="middle" fontFamily="monospace">✦ AI…</text>
                <rect x={0} y={H - 4} width={W} height={4} fill="rgba(0,255,100,0.4)" />
              </svg>
            ) : (
              <Schematic type={opt.type} hovered={hovered === opt.type} />
            )}
            <span style={{
              fontSize: 10,
              fontFamily: '"Saans", sans-serif',
              color: isLoading ? '#00ff64' : hovered === opt.type ? '#F8FFFA' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.15s',
            }}>
              {isLoading ? 'Remixing…' : opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
