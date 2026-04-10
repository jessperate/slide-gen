'use client';

import { useState, useRef, useEffect } from 'react';
import { WebSection } from '@/lib/webgen';
import WebGenEditor from '@/components/webgen/WebGenEditor';
import AirOpsLogo from '@/components/AirOpsLogo';

const TONES = ['Persuasive', 'Educational', 'Storytelling', 'Formal', 'Bold'];

export default function WebGenPage() {
  const [sections, setSections] = useState<WebSection[] | null>(null);
  const [mode, setMode] = useState<'generate' | 'pdf'>('generate');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Persuasive');
  const [contextOpen, setContextOpen] = useState(false);
  const [contextText, setContextText] = useState('');
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfDragging, setPdfDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'generate') textareaRef.current?.focus();
  }, [mode]);

  const handlePdfFile = (file: File | null) => {
    if (!file || file.type !== 'application/pdf') return;
    if (file.size > 3 * 1024 * 1024) {
      setError('PDF must be under 3 MB for processing. Try reducing the number of pages or compressing images.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPdfData(e.target?.result as string);
      setPdfName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (mode === 'pdf') {
      if (!pdfData) return;
      setLoading(true);
      setError('');
      try {
        const body = JSON.stringify({ pdfData, audience, tone });
        // Vercel has a ~4.5MB body limit — warn if PDF is too large
        if (body.length > 4 * 1024 * 1024) {
          throw new Error('PDF is too large. Please use a file under ~3 MB, or reduce the number of pages.');
        }
        const res = await fetch('/api/webgen/reformat-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { throw new Error('Server error: ' + text.slice(0, 100)); }
        if (!res.ok || !data.sections) throw new Error(data.error || 'Failed to redesign');
        setSections(data.sections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setLoading(false);
      }
      return;
    }

    // Generate mode
    if (!topic.trim() && !contextText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/webgen/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'the provided content',
          audience,
          tone,
          context: contextText.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.sections) throw new Error(data.error || 'Failed to generate');
      setSections(data.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const canSubmit =
    mode === 'pdf' ? !!pdfData :
    !!topic.trim() || !!contextText.trim();

  // ── Editor mode ──────────────────────────────────────────────────────────
  if (sections) {
    return (
      <WebGenEditor
        sections={sections}
        onChange={setSections}
        onBack={() => setSections(null)}
      />
    );
  }

  // ── Input mode ───────────────────────────────────────────────────────────
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
        overflow: 'auto',
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
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {(['generate', 'pdf'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: mode === m ? '2px solid rgba(0,255,100,0.7)' : '2px solid transparent',
                padding: '0 0 10px 0',
                marginRight: 24,
                marginBottom: -1,
                cursor: 'pointer',
                fontFamily: '"Saans", sans-serif',
                fontSize: 13,
                fontWeight: mode === m ? 600 : 400,
                color: mode === m ? 'rgba(0,255,100,0.9)' : 'rgba(255,255,255,0.35)',
                transition: 'color 0.15s',
              }}
            >
              {m === 'generate' ? 'Generate from scratch' : 'Redesign existing PDF'}
            </button>
          ))}
        </div>

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
          {mode === 'generate' ? "What's your presentation about?" : 'Upload your existing deck'}
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
          {mode === 'generate'
            ? "Describe your topic and we'll build an HTML presentation with branded sections you can edit inline."
            : "We'll extract your content and redesign it as a branded HTML deck you can edit inline."}
        </div>

        {/* ── Generate mode input ─────────────────────────────────────── */}
        {mode === 'generate' ? (
          <>
            <textarea
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Q3 product launch for enterprise marketing teams"
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

            {/* Add context */}
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => setContextOpen(!contextOpen)}
                style={{
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: 'pointer', fontFamily: '"Saans", sans-serif',
                  fontSize: 12,
                  color: contextOpen ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.35)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = contextOpen ? 'rgba(0,255,100,0.9)' : 'rgba(255,255,255,0.6)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = contextOpen ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.35)')}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>{contextOpen ? '-' : '+'}</span>
                Add context
              </button>

              {contextOpen && (
                <div style={{
                  marginTop: 10,
                  border: '1px solid rgba(0,255,100,0.15)',
                  background: 'rgba(0,255,100,0.03)',
                  padding: '12px 14px',
                }}>
                  <textarea
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="Paste additional context: meeting notes, product descriptions, key messaging..."
                    rows={4}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontFamily: '"Saans", sans-serif',
                      fontSize: 13,
                      lineHeight: 1.5,
                      padding: '10px 12px',
                      resize: 'none',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.3)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <div style={{
                    fontFamily: '"Saans", sans-serif', fontSize: 11,
                    color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5,
                  }}>
                    This will be used as background context when generating your presentation.
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ── PDF mode input ──────────────────────────────────────── */
          <div style={{ marginBottom: 16 }}>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handlePdfFile(e.target.files?.[0] ?? null)}
            />
            {pdfData ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  border: '1px solid rgba(0,255,100,0.3)',
                  background: 'rgba(0,255,100,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className="ri-file-pdf-2-line" style={{ fontSize: 18, color: 'rgba(0,255,100,0.6)' }} />
                  <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    {pdfName}
                  </span>
                </div>
                <button
                  onClick={() => { setPdfData(null); setPdfName(''); }}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', fontSize: 14, padding: 0,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  &#10005;
                </button>
              </div>
            ) : (
              <div
                onClick={() => pdfInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setPdfDragging(true); }}
                onDragLeave={() => setPdfDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setPdfDragging(false);
                  handlePdfFile(e.dataTransfer.files?.[0] ?? null);
                }}
                style={{
                  width: '100%',
                  padding: '40px 16px',
                  border: `1px dashed ${pdfDragging ? 'rgba(0,255,100,0.6)' : 'rgba(255,255,255,0.15)'}`,
                  background: pdfDragging ? 'rgba(0,255,100,0.06)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => { if (!pdfDragging) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,100,0.4)'; }}
                onMouseLeave={(e) => { if (!pdfDragging) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                <i className="ri-upload-2-line" style={{ fontSize: 28, color: 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  Drop your PDF here or click to browse
                </span>
                <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                  Max 3 MB
                </span>
              </div>
            )}
          </div>
        )}

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
            <div style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)', fontSize: 10,
              pointerEvents: 'none',
            }}>
              &#9662;
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            color: '#ff6464', fontSize: 13, marginBottom: 16,
            fontFamily: '"Saans Mono", monospace',
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            style={{
              background: canSubmit && !loading ? '#00ff64' : 'rgba(0,255,100,0.2)',
              border: 'none',
              color: canSubmit && !loading ? '#002910' : 'rgba(0,255,100,0.4)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: canSubmit && !loading ? 'pointer' : 'default',
              padding: '12px 28px',
              borderRadius: 58,
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>&#9676;</span>
                {mode === 'pdf' ? 'Redesigning your deck...' : 'Building your deck...'}
              </>
            ) : (
              <>
                {mode === 'pdf' ? 'Redesign deck' : 'Generate deck'}
                {mode === 'generate' && <span style={{ opacity: 0.6, fontSize: 11 }}>&#8984;&#8629;</span>}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <div style={{
        marginTop: 24,
        fontFamily: '"Saans Mono", monospace',
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.08em',
      }}>
        AIROPS DECKGEN
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
