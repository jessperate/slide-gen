'use client';

import { useState } from 'react';
import { SlideData } from '@/lib/slides';
import { remixToType, REMIX_OPTIONS } from '@/lib/remixLayout';

const W = 48;
const H = 27;
const fill = 'rgba(255,255,255,0.15)';
const accent = 'rgba(0,255,100,0.35)';

function Schematic({ type }: { type: string }) {
  switch (type) {
    case 'cover':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={5} y={5} width={20} height={2} rx={1} fill={fill} />
        <rect x={5} y={9} width={32} height={5} rx={1} fill="rgba(255,255,255,0.25)" />
        <rect x={5} y={16} width={14} height={2} rx={1} fill={fill} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'section':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={4} y={4} width={8} height={8} rx={1} fill={accent} opacity={0.5} />
        <rect x={5} y={14} width={32} height={4} rx={1} fill="rgba(255,255,255,0.25)" />
        <rect x={5} y={20} width={18} height={2} rx={1} fill={fill} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'two-col-media':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={4} width={18} height={2} rx={1} fill={fill} />
        <rect x={3} y={8} width={18} height={5} rx={1} fill="rgba(255,255,255,0.2)" />
        <rect x={3} y={15} width={12} height={2} rx={1} fill={fill} />
        <rect x={26} y={3} width={19} height={18} rx={1} fill="rgba(255,255,255,0.08)" />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'quote':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <text x={4} y={13} fontSize={12} fill={accent} opacity={0.7}>"</text>
        <rect x={10} y={8} width={32} height={3} rx={1} fill="rgba(255,255,255,0.25)" />
        <rect x={10} y={13} width={26} height={2} rx={1} fill={fill} />
        <rect x={10} y={18} width={14} height={2} rx={1} fill={fill} opacity={0.5} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'big-quote':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={4} y={5} width={40} height={4} rx={1} fill="rgba(255,255,255,0.3)" />
        <rect x={4} y={11} width={36} height={4} rx={1} fill="rgba(255,255,255,0.2)" />
        <rect x={4} y={18} width={18} height={2} rx={1} fill={fill} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'three-col':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={36} height={2} rx={1} fill={fill} />
        {[0, 1, 2].map(i => (
          <g key={i}>
            <rect x={3 + i * 15} y={8} width={12} height={3} rx={1} fill="rgba(255,255,255,0.22)" />
            <rect x={3 + i * 15} y={13} width={12} height={2} rx={1} fill={fill} />
            <rect x={3 + i * 15} y={17} width={9} height={2} rx={1} fill={fill} opacity={0.6} />
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'feature-list':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={28} height={2} rx={1} fill={fill} />
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect x={3} y={8 + i * 4} width={3} height={3} rx={0.5} fill={accent} opacity={0.6} />
            <rect x={8} y={8 + i * 4} width={26} height={2} rx={1} fill="rgba(255,255,255,0.18)" />
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'content':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={34} height={2} rx={1} fill={fill} />
        {[0, 1].map(i => (
          <g key={i}>
            <rect x={3 + i * 23} y={8} width={18} height={2} rx={1} fill="rgba(255,255,255,0.28)" />
            <rect x={3 + i * 23} y={12} width={18} height={2} rx={1} fill={fill} />
            <rect x={3 + i * 23} y={16} width={14} height={2} rx={1} fill={fill} opacity={0.6} />
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'diagram':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={32} height={2} rx={1} fill={fill} />
        {[0, 1, 2].map(i => (
          <g key={i}>
            <rect x={3 + i * 15} y={8} width={12} height={12} rx={1} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
            <rect x={5 + i * 15} y={11} width={8} height={2} rx={1} fill="rgba(255,255,255,0.22)" />
            {i < 2 && <path d={`M${15 + i * 15} 14 L${17 + i * 15} 14`} stroke={accent} strokeWidth={1} />}
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'stats':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={30} height={2} rx={1} fill={fill} />
        {[0, 1, 2].map(i => (
          <g key={i}>
            <rect x={3 + i * 15} y={8} width={12} height={8} rx={1} fill="rgba(255,255,255,0.07)" />
            <rect x={5 + i * 15} y={10} width={8} height={3} rx={1} fill="rgba(255,255,255,0.28)" />
          </g>
        ))}
        <rect x={3} y={18} width={38} height={2} rx={1} fill={fill} opacity={0.5} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'customer-story':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={12} height={3} rx={1} fill={accent} opacity={0.4} />
        <rect x={3} y={8} width={26} height={3} rx={1} fill="rgba(255,255,255,0.25)" />
        <rect x={3} y={13} width={20} height={2} rx={1} fill={fill} />
        <rect x={28} y={7} width={17} height={10} rx={1} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'checklist':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={26} height={2} rx={1} fill={fill} />
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect x={3} y={8 + i * 4} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth={0.4} />
            {i < 2 && <path d={`M${3.5} ${9.5 + i * 4} L${4.8} ${11 + i * 4} L${6.5} ${8.8 + i * 4}`} stroke={accent} strokeWidth={0.8} fill="none" />}
            <rect x={9} y={8 + i * 4} width={24} height={2} rx={1} fill="rgba(255,255,255,0.15)" />
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'agenda':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={12} y={3} width={24} height={3} rx={1} fill="rgba(255,255,255,0.25)" />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={8} y={9 + i * 3} width={32} height={1.5} rx={0.5} fill="rgba(255,255,255,0.14)" />
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'hero':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={5} y={5} width={38} height={5} rx={1} fill="rgba(255,255,255,0.28)" />
        <rect x={10} y={12} width={28} height={3} rx={1} fill={fill} />
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={3 + i * 11} y={17} width={9} height={4} rx={0.5} fill="rgba(255,255,255,0.09)" />
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'back-cover':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={6} y={6} width={36} height={5} rx={1} fill="rgba(255,255,255,0.25)" />
        <rect x={14} y={14} width={20} height={5} rx={1} fill={accent} opacity={0.35} />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'team':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={13} y={2} width={22} height={2} rx={1} fill={fill} />
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <circle cx={6 + i * 10} cy={13} r={4} fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
            <rect x={3 + i * 10} y={18} width={8} height={1.5} rx={0.5} fill={fill} opacity={0.7} />
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    case 'contact':
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={13} y={2} width={22} height={2} rx={1} fill={fill} />
        {[0, 1].map(i => (
          <g key={i}>
            <rect x={4 + i * 23} y={7} width={19} height={14} rx={1} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
            <circle cx={13 + i * 23} cy={12} r={3} fill="rgba(255,255,255,0.12)" />
            <rect x={7 + i * 23} y={17} width={13} height={1.5} rx={0.5} fill={fill} opacity={0.5} />
          </g>
        ))}
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;

    default:
      return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={3} y={3} width={42} height={18} rx={1} fill="rgba(255,255,255,0.07)" />
        <rect x={0} y={24} width={W} height={3} fill={accent} />
      </svg>;
  }
}

interface RemixBarProps {
  slide: SlideData;
  onRemix: (remixed: SlideData) => void;
}

export default function RemixBar({ slide, onRemix }: RemixBarProps) {
  const options = REMIX_OPTIONS[slide.type] ?? [];
  const [hovered, setHovered] = useState<string | null>(null);

  if (options.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: 'rgba(10,10,10,0.92)',
        border: '1px solid #2a2a2a',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      <div style={{
        fontSize: 9,
        fontFamily: '"Saans Mono", monospace',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
        whiteSpace: 'nowrap',
        paddingRight: 8,
        borderRight: '1px solid #2a2a2a',
        marginRight: 2,
        lineHeight: 1,
      }}>
        Remix layout
      </div>

      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => onRemix(remixToType(slide, opt.type))}
          onMouseEnter={() => setHovered(opt.type)}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === opt.type ? '#1a1a1a' : 'transparent',
            border: `1px solid ${hovered === opt.type ? '#3a3a3a' : '#222'}`,
            color: hovered === opt.type ? '#F8FFFA' : 'rgba(255,255,255,0.45)',
            fontFamily: '"Saans", sans-serif',
            fontSize: 10,
            cursor: 'pointer',
            padding: '5px 8px 4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            transition: 'border-color 0.15s, background 0.15s, color 0.15s',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <Schematic type={opt.type} />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
