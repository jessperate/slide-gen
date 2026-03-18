'use client';

import { useState, useRef, useEffect } from 'react';
import AirOpsLogo from '@/components/AirOpsLogo';

interface Props {
  onGenerate: (slides: unknown[]) => void;
  onSkip: () => void;
}

const TONES = ['Persuasive', 'Storytelling', 'Educational', 'Formal', 'Funny'];

interface UploadedImage {
  dataUrl: string;
  mediaType: string;
  name: string;
}

export default function OnboardingScreen({ onGenerate, onSkip }: Props) {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Persuasive');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [contextTab, setContextTab] = useState<'paste' | 'url'>('paste');
  const [contextText, setContextText] = useState('');
  const [contextUrl, setContextUrl] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [mode, setMode] = useState<'generate' | 'reformat' | 'from-url'>('generate');
  const [sourceUrl, setSourceUrl] = useState('');
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfDragging, setPdfDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handlePdfFile = (file: File | null) => {
    if (!file || file.type !== 'application/pdf') return;
    if (file.size > 15 * 1024 * 1024) {
      setError('PDF must be under 15 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPdfData(dataUrl);
      setPdfName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 5 - images.length).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const match = dataUrl.match(/^data:([^;]+);base64,/);
        if (!match) return;
        setImages((prev) => [
          ...prev,
          { dataUrl, mediaType: match[1], name: file.name },
        ].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (mode === 'reformat') {
      if (!pdfData) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/reformat-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfData, audience, tone }),
        });
        const data = await res.json();
        if (!res.ok || !data.slides) throw new Error(data.error || 'Failed');
        onGenerate(data.slides);
      } catch (err) {
        setError('Error: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
      return;
    }

    if (mode === 'from-url') {
      if (!sourceUrl.trim()) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/from-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: sourceUrl.trim(), audience, tone }),
        });
        const data = await res.json();
        if (!res.ok || !data.slides) throw new Error(data.error || 'Failed');
        onGenerate(data.slides);
      } catch (err) {
        setError('Error: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
      return;
    }

    const hasContext = (contextTab === 'paste' && contextText.trim()) || (contextTab === 'url' && contextUrl.trim());
    if (!topic.trim() && !hasContext) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'the provided content',
          audience,
          tone,
          context: contextTab === 'paste' && contextText.trim() ? contextText : undefined,
          contextUrl: contextTab === 'url' && contextUrl.trim() ? contextUrl : undefined,
          images: images.length > 0 ? images.map(({ dataUrl, mediaType }) => ({ dataUrl, mediaType })) : undefined,
        }),
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

  const hasContext = (contextTab === 'paste' && contextText.trim()) || (contextTab === 'url' && contextUrl.trim());
  const canSubmit =
    mode === 'reformat' ? !!pdfData :
    mode === 'from-url' ? !!sourceUrl.trim() :
    !!topic.trim() || !!hasContext;

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
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {(['generate', 'from-url', 'reformat'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
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
              {m === 'generate' ? 'Generate from scratch' : m === 'from-url' ? 'From URL' : 'Reformat existing PDF'}
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
          {mode === 'generate' ? "What's your presentation about?" : mode === 'from-url' ? 'Turn any page into a deck' : 'Upload your existing deck'}
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
            ? "Describe your topic and we'll build a full deck with a narrative arc."
            : mode === 'from-url'
            ? "Paste any public URL — blog post, landing page, Notion doc — and we'll turn it into slides."
            : "We'll extract your content and reformat it in AirOps brand style."}
        </div>

        {/* Topic textarea OR URL input OR PDF upload */}
        {mode === 'from-url' ? (
          <div style={{ marginBottom: 16 }}>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://your-site.com/blog/article-or-landing-page"
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 0,
                color: '#ffffff',
                fontFamily: '"Saans", sans-serif',
                fontSize: 15,
                padding: '14px 16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
              Works with publicly accessible pages. Notion, blog posts, product pages, documentation — anything with text content.
            </div>
          </div>
        ) : mode === 'generate' ? (
          <textarea
            ref={textareaRef}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasContext ? "Topic (optional — we'll derive it from your content)" : "e.g. How AirOps helps B2B SaaS companies scale content without headcount"}
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
        ) : (
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
                  <span style={{ fontSize: 18 }}>📄</span>
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
                  ✕
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
                  padding: '32px 16px',
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
                <span style={{ fontSize: 28, opacity: 0.5 }}>↑</span>
                <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  Drop your PDF here or click to browse
                </span>
                <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                  Max 15 MB
                </span>
              </div>
            )}
          </div>
        )}

        {/* Add context expander — generate mode only */}
        <div style={{ marginBottom: 16, display: mode === 'generate' ? undefined : 'none' }}>
          <button
            onClick={() => setContextOpen((o) => !o)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: '"Saans", sans-serif',
              fontSize: 12,
              color: contextOpen ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = contextOpen ? 'rgba(0,255,100,0.9)' : 'rgba(255,255,255,0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = contextOpen ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.35)')}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{contextOpen ? '−' : '＋'}</span>
            Add context
          </button>

          {contextOpen && (
            <div
              style={{
                marginTop: 10,
                border: '1px solid rgba(0,255,100,0.15)',
                background: 'rgba(0,255,100,0.03)',
              }}
            >
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,255,100,0.1)' }}>
                {(['paste', 'url'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setContextTab(tab)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      borderBottom: contextTab === tab ? '2px solid rgba(0,255,100,0.6)' : '2px solid transparent',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontFamily: '"Saans", sans-serif',
                      fontSize: 12,
                      color: contextTab === tab ? 'rgba(0,255,100,0.8)' : 'rgba(255,255,255,0.35)',
                      transition: 'color 0.15s',
                      marginBottom: -1,
                    }}
                  >
                    {tab === 'paste' ? 'Paste content' : 'From URL'}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ padding: '12px 14px' }}>
                {contextTab === 'paste' ? (
                  <textarea
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="Paste Notion content, meeting notes, Slack threads, doc excerpts…"
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
                ) : (
                  <input
                    type="url"
                    value={contextUrl}
                    onChange={(e) => setContextUrl(e.target.value)}
                    placeholder="https://notion.so/… or any public URL"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontFamily: '"Saans", sans-serif',
                      fontSize: 13,
                      padding: '10px 12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,255,100,0.3)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                )}
                <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
                  {contextTab === 'paste'
                    ? 'Claude will use this as background context when building your deck.'
                    : 'Works with publicly shared Notion pages, websites, or any public URL.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image upload expander — generate mode only */}
        <div style={{ marginBottom: 16, display: mode === 'generate' ? undefined : 'none' }}>
          <button
            onClick={() => setImagesOpen((o) => !o)}
            style={{
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: '"Saans", sans-serif', fontSize: 12,
              color: imagesOpen ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = imagesOpen ? 'rgba(0,255,100,0.9)' : 'rgba(255,255,255,0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = imagesOpen ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.35)')}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{imagesOpen ? '−' : '＋'}</span>
            Add images {images.length > 0 && <span style={{ color: 'rgba(0,255,100,0.6)' }}>({images.length})</span>}
          </button>

          {imagesOpen && (
            <div style={{ marginTop: 10, border: '1px solid rgba(0,255,100,0.15)', background: 'rgba(0,255,100,0.03)', padding: '12px 14px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleImageFiles(e.target.files)}
              />
              {/* Thumbnails */}
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        style={{ width: 64, height: 64, objectFit: 'cover', display: 'block', border: '1px solid rgba(0,255,100,0.2)' }}
                      />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        style={{
                          position: 'absolute', top: -6, right: -6, width: 16, height: 16,
                          background: '#333', border: '1px solid #555', borderRadius: '50%',
                          color: '#fff', fontSize: 9, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0,
                        }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%', background: 'transparent', border: '1px dashed rgba(0,255,100,0.25)',
                    color: 'rgba(255,255,255,0.4)', fontFamily: '"Saans", sans-serif', fontSize: 12,
                    cursor: 'pointer', padding: '10px', transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,100,0.5)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,100,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  {images.length === 0 ? '↑ Upload images (up to 5)' : '↑ Add more'}
                </button>
              )}
              <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
                Claude will analyze your images and place them on the most relevant slides.
              </div>
            </div>
          )}
        </div>

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
                {mode === 'reformat' ? 'Reformatting your deck…' : mode === 'from-url' ? 'Fetching and building…' : 'Crafting your deck…'}
              </>
            ) : (
              <>
                {mode === 'reformat' ? 'Reformat deck' : mode === 'from-url' ? 'Build from URL' : 'Generate deck'}
                {mode !== 'reformat' && <span style={{ opacity: 0.6, fontSize: 11 }}>⌘↵</span>}
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
