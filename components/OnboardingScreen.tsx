'use client';

import { useState, useRef, useEffect } from 'react';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  onGenerate: (slides: unknown[]) => void;
  onSkip: () => void;
}

const TONES = ['Persuasive', 'Storytelling', 'Educational', 'Formal'];

export default function OnboardingScreen({ onGenerate, onSkip }: Props) {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Persuasive');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, tone }),
      });
      const data = await res.json();
      if (!res.ok || !data.slides) throw new Error(data.error || 'Failed');
      onGenerate(data.slides);
    } catch {
      setError('Something went wrong — please try again.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#002910',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        fontFamily: '"Saans", sans-serif',
        backgroundImage: 'radial-gradient(circle, rgba(0,255,100,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 48 }}>
        <AirOpsLogo color="#ffffff" width={160} />
      </div>

      {/* Card */}
      <div
        style={{
          width: 600,
          background: 'rgba(0,15,8,0.7)',
          border: '1px solid rgba(0,255,100,0.15)',
          padding: 48,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Heading */}
        <div
          style={{
            fontFamily: '"Serrif VF", serif',
            fontSize: 32,
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          What's your presentation about?
        </div>
        <div
          style={{
            fontFamily: '"Saans", sans-serif',
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 32,
            lineHeight: 1.5,
          }}
        >
          Describe your topic and we'll build a full deck with a narrative arc.
        </div>

        {/* Topic textarea */}
        <textarea
          ref={textareaRef}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. How AirOps helps B2B SaaS companies scale content without headcount"
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 0,
            color: '#ffffff',
            fontFamily: '"Saans", sans-serif',
            fontSize: 15,
            lineHeight: 1.5,
            padding: '14px 16px',
            resize: 'none',
            outline: 'none',
            marginBottom: 16,
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.4)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
        />

        {/* Row: audience + tone */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Audience (optional)"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 0,
              color: '#ffffff',
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              padding: '10px 14px',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 0,
                color: '#ffffff',
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                padding: '10px 36px 10px 14px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              {TONES.map((t) => (
                <option key={t} value={t} style={{ background: '#002910' }}>
                  {t}
                </option>
              ))}
            </select>
            <div
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 10,
                pointerEvents: 'none',
              }}
            >
              ▾
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              color: '#ff6464',
              fontSize: 13,
              marginBottom: 16,
              fontFamily: '"Saans Mono", monospace',
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onSkip}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            Use demo deck instead
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            style={{
              background: topic.trim() && !loading ? '#00ff64' : 'rgba(0,255,100,0.2)',
              border: 'none',
              color: topic.trim() && !loading ? '#002910' : 'rgba(0,255,100,0.4)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: topic.trim() && !loading ? 'pointer' : 'default',
              padding: '12px 28px',
              borderRadius: 0,
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                Crafting your deck…
              </>
            ) : (
              <>
                Generate deck
                <span style={{ opacity: 0.6, fontSize: 11 }}>⌘↵</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <div
        style={{
          marginTop: 24,
          fontFamily: '"Saans Mono", monospace',
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.08em',
        }}
      >
        AIROPS SLIDEGEN
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
