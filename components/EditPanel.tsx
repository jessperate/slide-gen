'use client';

import { useState, useRef } from 'react';
import AirOpsLogo from '@/components/AirOpsLogo';
import {
  SlideData,
  LogoOverlay,
  DiagramSlideData,
  StatsSlideData,
  ContentSlideData,
  HeroSlideData,
  AgendaSlideData,
  QuoteSlideData,
  ThreeColSlideData,
  FeatureListSlideData,
  CustomerStorySlideData,
  ChecklistSlideData,
  BigQuoteSlideData,
  TwoColMediaSlideData,
  ContactSlideData,
  TeamSlideData,
} from '@/lib/slides';
import { ColorMode, THEMES } from '@/lib/themes';

interface Props {
  slide: SlideData;
  onChange: (updated: SlideData) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  slideColorMode: ColorMode | undefined;
  onSlideColorModeChange: (mode: ColorMode | undefined) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: 0,
  color: '#F8FFFA',
  fontFamily: '"Saans", sans-serif',
  fontSize: 13,
  fontWeight: 400,
  padding: '8px 10px',
  outline: 'none',
  resize: 'vertical',
  lineHeight: 1.5,
};

const labelStyle: React.CSSProperties = {
  fontFamily: '"Saans Mono", monospace',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 6,
  display: 'block',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 20,
};

const groupDividerStyle: React.CSSProperties = {
  borderTop: '1px solid #2a2a2a',
  marginTop: 16,
  paddingTop: 16,
};

const groupLabelStyle: React.CSSProperties = {
  fontFamily: '"Saans Mono", monospace',
  fontSize: 9,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.25)',
  marginBottom: 12,
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  short = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  short?: boolean;
}) {
  return (
    <div style={sectionStyle}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={inputStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, width: short ? 80 : '100%' }}
        />
      )}
    </div>
  );
}

const GIPHY_KEY = 'dcf93d4f15744aa9b5b3d74c8e09a39b';

interface GifResult {
  id: string;
  images: {
    fixed_height_small: { url: string };
    original: { url: string };
  };
}

function MemberImageUpload({
  imageUrl,
  onUpdate,
}: {
  imageUrl: string | undefined;
  onUpdate: (url: string | undefined) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setLoading(true);
    setError('');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          resolve(result.split(',')[1]); // strip data:...;base64,
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/stipple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      onUpdate(`data:${data.mimeType};base64,${data.imageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={sectionStyle}>
      <label style={labelStyle}>Photo</label>
      {imageUrl && (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img
            src={imageUrl}
            alt=""
            style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block', border: '1px solid #2a2a2a', filter: 'grayscale(100%)' }}
          />
          <button
            onClick={() => onUpdate(undefined)}
            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 11, cursor: 'pointer', padding: '2px 6px' }}
          >
            ✕
          </button>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        style={{
          width: '100%',
          background: '#1a1a1a',
          border: '1px dashed #3a3a3a',
          color: loading ? 'rgba(0,255,100,0.6)' : 'rgba(255,255,255,0.5)',
          fontFamily: '"Saans", sans-serif',
          fontSize: 12,
          cursor: loading ? 'default' : 'pointer',
          padding: '10px',
          textAlign: 'center',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = '#008c44'; e.currentTarget.style.color = '#008c44'; } }}
        onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
      >
        {loading ? '✦ Applying stipple effect…' : '↑ Upload photo'}
      </button>
      {error && <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: '#ff6464', marginTop: 6 }}>{error}</div>}
      {!error && !loading && (
        <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6, lineHeight: 1.5 }}>
          Gemini will apply a stipple illustration effect
        </div>
      )}
    </div>
  );
}

function BrandfetchSection({
  logos,
  onUpdate,
}: {
  logos: LogoOverlay[];
  onUpdate: (logos: LogoOverlay[]) => void;
}) {
  const [domain, setDomain] = useState('');
  const [preview, setPreview] = useState('');
  const [imgError, setImgError] = useState(false);

  const cleanDomain = (raw: string) =>
    raw.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  const handleInput = (v: string) => {
    setDomain(v);
    setPreview(cleanDomain(v));
    setImgError(false);
  };

  const addLogo = () => {
    if (!preview || imgError) return;
    const newLogo: LogoOverlay = {
      id: `logo-${Date.now()}`,
      domain: preview,
      x: 50,
      y: 85,
      width: 120,
    };
    onUpdate([...logos, newLogo]);
    setDomain('');
    setPreview('');
    setImgError(false);
  };

  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #2a2a2a' }}>
      <label style={labelStyle}>Brand Logos</label>

      {/* Existing logos list */}
      {logos.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {logos.map((logo) => (
            <div
              key={logo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                padding: '6px 8px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.brandfetch.io/${logo.domain}/w/200/h/60`}
                alt={logo.domain}
                style={{ height: 18, width: 'auto', flexShrink: 0, display: 'block' }}
              />
              <span
                style={{
                  flex: 1,
                  fontFamily: '"Saans Mono", monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {logo.domain}
              </span>
              <button
                onClick={() => onUpdate(logos.filter((l) => l.id !== logo.id))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: '0 2px',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Domain input + add button */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addLogo()}
          placeholder="e.g. hubspot.com"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={addLogo}
          disabled={!preview || imgError}
          style={{
            background: preview && !imgError ? '#008c44' : '#2a2a2a',
            border: `1px solid ${preview && !imgError ? '#008c44' : '#3a3a3a'}`,
            color: '#F8FFFA',
            fontFamily: '"Saans", sans-serif',
            fontSize: 14,
            cursor: preview && !imgError ? 'pointer' : 'default',
            padding: '6px 12px',
            flexShrink: 0,
            transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          +
        </button>
      </div>

      {/* Logo preview */}
      {preview && (
        <div
          style={{
            marginTop: 8,
            background: '#0f0f0f',
            border: '1px solid #2a2a2a',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
          }}
        >
          {imgError ? (
            <span style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: '#ff6464' }}>
              Logo not found
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://cdn.brandfetch.io/${preview}/w/400/h/120`}
              alt=""
              onError={() => setImgError(true)}
              onLoad={() => setImgError(false)}
              style={{ height: 28, width: 'auto', display: 'block' }}
            />
          )}
        </div>
      )}

      <div
        style={{
          fontFamily: '"Saans", sans-serif',
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          marginTop: 6,
          lineHeight: 1.5,
        }}
      >
        Drag logos on the slide to reposition
      </div>
    </div>
  );
}

function GiphySearch({ onSelect }: { onSelect: (url: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(query)}&limit=12&rating=g`
      );
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #2a2a2a' }}>
      <label style={labelStyle}>Giphy</label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search GIFs…"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={search}
          style={{
            background: '#2a2a2a',
            border: '1px solid #3a3a3a',
            color: '#F8FFFA',
            fontFamily: '"Saans", sans-serif',
            fontSize: 12,
            cursor: 'pointer',
            padding: '6px 10px',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          ↵
        </button>
      </div>
      {error && <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 11, color: '#ff6464', marginTop: 6 }}>{error}</div>}
      {results.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 4,
            marginTop: 8,
            opacity: loading ? 0.4 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {results.map((gif) => (
            <button
              key={gif.id}
              onClick={() => onSelect(gif.images.original.url)}
              title="Use this GIF"
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                background: '#1a1a1a',
                overflow: 'hidden',
                border: '1px solid #2a2a2a',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#008c44')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
            >
              <img
                src={gif.images.fixed_height_small.url}
                alt=""
                style={{ width: '100%', height: 56, objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageSection({
  imageUrl,
  onUpdate,
}: {
  imageUrl: string | undefined;
  onUpdate: (url: string | undefined) => void;
}) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #2a2a2a' }}>
      <label style={labelStyle}>Image</label>

      {/* Preview */}
      {imageUrl && (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img
            src={imageUrl}
            alt=""
            style={{ width: '100%', height: 60, objectFit: 'cover', display: 'block', border: '1px solid #2a2a2a' }}
          />
          <button
            onClick={() => onUpdate(undefined)}
            title="Remove image"
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 11,
              cursor: 'pointer',
              padding: '2px 6px',
              lineHeight: 1.4,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a', marginBottom: 8 }}>
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid #008c44' : '2px solid transparent',
              padding: '5px 0',
              cursor: 'pointer',
              fontFamily: '"Saans", sans-serif',
              fontSize: 11,
              color: tab === t ? '#008c44' : 'rgba(255,255,255,0.35)',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {t === 'upload' ? 'Upload' : 'URL'}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,image/gif"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px dashed #3a3a3a',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 12,
              cursor: 'pointer',
              padding: '10px',
              textAlign: 'center',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#008c44'; e.currentTarget.style.color = '#008c44'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            ↑ Choose file
          </button>
        </>
      ) : (
        <input
          type="text"
          value={imageUrl?.startsWith('data:') ? '' : (imageUrl ?? '')}
          onChange={(e) => onUpdate(e.target.value || undefined)}
          placeholder="https://..."
          style={{ ...inputStyle }}
        />
      )}
    </div>
  );
}

export default function EditPanel({ slide, onChange, colorMode, onColorModeChange, slideColorMode, onSlideColorModeChange }: Props) {
  const update = (patch: Partial<SlideData>) => {
    onChange({ ...slide, ...patch } as SlideData);
  };

  const panelContent = () => {
    switch (slide.type) {
      case 'cover':
        return (
          <>
            <Field
              label="Eyebrow"
              value={slide.eyebrow}
              onChange={(v) => update({ eyebrow: v })}
            />
            <Field
              label="Headline"
              value={slide.headline}
              onChange={(v) => update({ headline: v })}
              multiline
            />
            <Field
              label="Subheadline"
              value={slide.subheadline || ''}
              onChange={(v) => update({ subheadline: v })}
            />
          </>
        );

      case 'section':
        return (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: '0 0 60px' }}>
                <label style={labelStyle}>Number</label>
                <input
                  type="text"
                  value={slide.number}
                  onChange={(e) => update({ number: e.target.value })}
                  style={{ ...inputStyle, width: 60 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Label</label>
                <input
                  type="text"
                  value={slide.label}
                  onChange={(e) => update({ label: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            <Field
              label="Headline"
              value={slide.headline}
              onChange={(v) => update({ headline: v })}
              multiline
            />
          </>
        );

      case 'diagram': {
        const diagramSlide = slide as DiagramSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={diagramSlide.headline}
              onChange={(v) => update({ headline: v })}
            />
            {diagramSlide.columns.map((col, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Column {i + 1}</div>
                <Field
                  label="Header"
                  value={col.header}
                  onChange={(v) => {
                    const cols = [...diagramSlide.columns];
                    cols[i] = { ...cols[i], header: v };
                    update({ columns: cols });
                  }}
                />
                <Field
                  label="Body"
                  value={col.body}
                  onChange={(v) => {
                    const cols = [...diagramSlide.columns];
                    cols[i] = { ...cols[i], body: v };
                    update({ columns: cols });
                  }}
                  multiline
                />
                <Field
                  label="Tag"
                  value={col.tag || ''}
                  onChange={(v) => {
                    const cols = [...diagramSlide.columns];
                    cols[i] = { ...cols[i], tag: v };
                    update({ columns: cols });
                  }}
                />
              </div>
            ))}
          </>
        );
      }

      case 'stats': {
        const statsSlide = slide as StatsSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={statsSlide.headline}
              onChange={(v) => update({ headline: v })}
            />
            <Field
              label="Thesis"
              value={statsSlide.thesis}
              onChange={(v) => update({ thesis: v })}
              multiline
            />
            {statsSlide.metrics.map((metric, i) => (
              <div key={i} style={groupDividerStyle}>
                <div style={groupLabelStyle}>Metric {i + 1}</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <div style={{ flex: '0 0 70px' }}>
                    <label style={labelStyle}>Value</label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => {
                        const metrics = [...statsSlide.metrics];
                        metrics[i] = { ...metrics[i], value: e.target.value };
                        update({ metrics });
                      }}
                      style={{ ...inputStyle, width: 70 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Label</label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => {
                        const metrics = [...statsSlide.metrics];
                        metrics[i] = { ...metrics[i], label: e.target.value };
                        update({ metrics });
                      }}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={sectionStyle}>
                  <label style={labelStyle}>Color</label>
                  <select
                    value={metric.color}
                    onChange={(e) => {
                      const metrics = [...statsSlide.metrics];
                      metrics[i] = {
                        ...metrics[i],
                        color: e.target.value as 'olive' | 'teal' | 'magenta',
                      };
                      update({ metrics });
                    }}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="olive">Olive</option>
                    <option value="teal">Teal</option>
                    <option value="magenta">Magenta</option>
                  </select>
                </div>
              </div>
            ))}
          </>
        );
      }

      case 'content': {
        const contentSlide = slide as ContentSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={contentSlide.headline}
              onChange={(v) => update({ headline: v })}
            />
            {contentSlide.columns.map((col, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Column {i + 1}</div>
                <Field
                  label="Heading"
                  value={col.heading}
                  onChange={(v) => {
                    const cols = [...contentSlide.columns];
                    cols[i] = { ...cols[i], heading: v };
                    update({ columns: cols });
                  }}
                />
                <Field
                  label="Body"
                  value={col.body}
                  onChange={(v) => {
                    const cols = [...contentSlide.columns];
                    cols[i] = { ...cols[i], body: v };
                    update({ columns: cols });
                  }}
                  multiline
                />
              </div>
            ))}
          </>
        );
      }

      case 'back-cover':
        return (
          <>
            <Field
              label="CTA"
              value={slide.cta}
              onChange={(v) => update({ cta: v })}
              multiline
            />
            <Field
              label="URL"
              value={slide.url}
              onChange={(v) => update({ url: v })}
            />
          </>
        );

      case 'hero': {
        const heroSlide = slide as HeroSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={heroSlide.headline}
              onChange={(v) => update({ headline: v })}
              multiline
            />
            {heroSlide.customerLogos.map((logo, i) => (
              <div key={i} style={i === 0 ? {} : { marginBottom: 0 }}>
                <Field
                  label={`Logo ${i + 1}`}
                  value={logo}
                  onChange={(v) => {
                    const logos = [...heroSlide.customerLogos];
                    logos[i] = v;
                    update({ customerLogos: logos });
                  }}
                />
              </div>
            ))}
          </>
        );
      }

      case 'agenda': {
        const agendaSlide = slide as AgendaSlideData;
        return (
          <>
            <Field
              label="Title"
              value={agendaSlide.title}
              onChange={(v) => update({ title: v })}
            />
            {agendaSlide.items.map((item, i) => (
              <Field
                key={i}
                label={`Item ${i + 1}`}
                value={item}
                onChange={(v) => {
                  const items = [...agendaSlide.items];
                  items[i] = v;
                  update({ items });
                }}
              />
            ))}
          </>
        );
      }

      case 'quote': {
        const quoteSlide = slide as QuoteSlideData;
        return (
          <>
            <Field
              label="Quote"
              value={quoteSlide.quote}
              onChange={(v) => update({ quote: v })}
              multiline
            />
            <Field
              label="Attribution"
              value={quoteSlide.attribution}
              onChange={(v) => update({ attribution: v })}
            />
          </>
        );
      }

      case 'three-col': {
        const threeColSlide = slide as ThreeColSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={threeColSlide.headline}
              onChange={(v) => update({ headline: v })}
            />
            {threeColSlide.columns.map((col, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Column {i + 1}</div>
                <Field
                  label="Icon"
                  value={col.icon}
                  onChange={(v) => {
                    const cols = [...threeColSlide.columns];
                    cols[i] = { ...cols[i], icon: v };
                    update({ columns: cols });
                  }}
                />
                <Field
                  label="Header"
                  value={col.header}
                  onChange={(v) => {
                    const cols = [...threeColSlide.columns];
                    cols[i] = { ...cols[i], header: v };
                    update({ columns: cols });
                  }}
                />
                <Field
                  label="Body"
                  value={col.body}
                  onChange={(v) => {
                    const cols = [...threeColSlide.columns];
                    cols[i] = { ...cols[i], body: v };
                    update({ columns: cols });
                  }}
                  multiline
                />
              </div>
            ))}
          </>
        );
      }

      case 'feature-list': {
        const featureListSlide = slide as FeatureListSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={featureListSlide.headline}
              onChange={(v) => update({ headline: v })}
            />
            {featureListSlide.items.map((item, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Item {i + 1}</div>
                <Field
                  label="Icon"
                  value={item.icon}
                  onChange={(v) => {
                    const items = [...featureListSlide.items];
                    items[i] = { ...items[i], icon: v };
                    update({ items });
                  }}
                />
                <Field
                  label="Title"
                  value={item.title}
                  onChange={(v) => {
                    const items = [...featureListSlide.items];
                    items[i] = { ...items[i], title: v };
                    update({ items });
                  }}
                />
                <Field
                  label="Body"
                  value={item.body}
                  onChange={(v) => {
                    const items = [...featureListSlide.items];
                    items[i] = { ...items[i], body: v };
                    update({ items });
                  }}
                  multiline
                />
              </div>
            ))}
          </>
        );
      }

      case 'customer-story': {
        const csSlide = slide as CustomerStorySlideData;
        return (
          <>
            <Field
              label="Customer Name"
              value={csSlide.customerName}
              onChange={(v) => update({ customerName: v })}
            />
            <Field
              label="Headline"
              value={csSlide.headline}
              onChange={(v) => update({ headline: v })}
              multiline
            />
            <Field
              label="Body"
              value={csSlide.body}
              onChange={(v) => update({ body: v })}
              multiline
            />
            <Field
              label="Attribution"
              value={csSlide.attribution}
              onChange={(v) => update({ attribution: v })}
            />
            {csSlide.metrics.map((metric, i) => (
              <div key={i} style={groupDividerStyle}>
                <div style={groupLabelStyle}>Metric {i + 1}</div>
                <Field
                  label="Value"
                  value={metric.value}
                  onChange={(v) => {
                    const metrics = [...csSlide.metrics];
                    metrics[i] = { ...metrics[i], value: v };
                    update({ metrics });
                  }}
                />
                <Field
                  label="Label"
                  value={metric.label}
                  onChange={(v) => {
                    const metrics = [...csSlide.metrics];
                    metrics[i] = { ...metrics[i], label: v };
                    update({ metrics });
                  }}
                />
              </div>
            ))}
          </>
        );
      }

      case 'checklist': {
        const checklistSlide = slide as ChecklistSlideData;
        return (
          <>
            <Field
              label="Headline"
              value={checklistSlide.headline}
              onChange={(v) => update({ headline: v })}
            />
            {checklistSlide.items.map((item, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Item {i + 1}</div>
                <Field
                  label="Title"
                  value={item.title}
                  onChange={(v) => {
                    const items = [...checklistSlide.items];
                    items[i] = { ...items[i], title: v };
                    update({ items });
                  }}
                />
                <Field
                  label="Body"
                  value={item.body}
                  onChange={(v) => {
                    const items = [...checklistSlide.items];
                    items[i] = { ...items[i], body: v };
                    update({ items });
                  }}
                  multiline
                />
                <div style={sectionStyle}>
                  <label style={labelStyle}>Checked</label>
                  <select
                    value={item.checked ? 'true' : 'false'}
                    onChange={(e) => {
                      const items = [...checklistSlide.items];
                      items[i] = { ...items[i], checked: e.target.value === 'true' };
                      update({ items });
                    }}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="true">Checked</option>
                    <option value="false">Unchecked</option>
                  </select>
                </div>
              </div>
            ))}
          </>
        );
      }

      case 'big-quote': {
        const bqSlide = slide as BigQuoteSlideData;
        return (
          <>
            <Field label="Quote" value={bqSlide.quote} onChange={(v) => update({ quote: v })} multiline />
            <Field label="Attribution" value={bqSlide.attribution} onChange={(v) => update({ attribution: v })} />
            <Field label="Role / Company" value={bqSlide.role ?? ''} onChange={(v) => update({ role: v })} />
          </>
        );
      }

      case 'two-col-media': {
        const tcmSlide = slide as TwoColMediaSlideData;
        return (
          <>
            <Field label="Eyebrow" value={tcmSlide.eyebrow ?? ''} onChange={(v) => update({ eyebrow: v })} />
            <Field label="Headline" value={tcmSlide.headline} onChange={(v) => update({ headline: v })} multiline />
            <Field label="Body" value={tcmSlide.body} onChange={(v) => update({ body: v })} multiline />
          </>
        );
      }

      case 'contact': {
        const contactSlide = slide as ContactSlideData;
        return (
          <>
            <Field label="Headline" value={contactSlide.headline} onChange={(v) => update({ headline: v })} />
            {contactSlide.cards.map((card, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Card {i + 1}</div>
                <Field label="Name" value={card.name} onChange={(v) => {
                  const cards = [...contactSlide.cards]; cards[i] = { ...cards[i], name: v }; update({ cards });
                }} />
                <Field label="Role" value={card.role} onChange={(v) => {
                  const cards = [...contactSlide.cards]; cards[i] = { ...cards[i], role: v }; update({ cards });
                }} />
                <Field label="LinkedIn" value={card.linkedin ?? ''} onChange={(v) => {
                  const cards = [...contactSlide.cards]; cards[i] = { ...cards[i], linkedin: v || undefined }; update({ cards });
                }} />
                <Field label="Email" value={card.email ?? ''} onChange={(v) => {
                  const cards = [...contactSlide.cards]; cards[i] = { ...cards[i], email: v || undefined }; update({ cards });
                }} />
                <Field label="Website" value={card.website ?? ''} onChange={(v) => {
                  const cards = [...contactSlide.cards]; cards[i] = { ...cards[i], website: v || undefined }; update({ cards });
                }} />
              </div>
            ))}
          </>
        );
      }

      case 'team': {
        const teamSlide = slide as TeamSlideData;
        return (
          <>
            <Field label="Headline" value={teamSlide.headline ?? ''} onChange={(v) => update({ headline: v })} />
            {teamSlide.members.map((member, i) => (
              <div key={i} style={i === 0 ? {} : groupDividerStyle}>
                <div style={groupLabelStyle}>Member {i + 1}</div>
                <Field label="Name" value={member.name} onChange={(v) => {
                  const members = [...teamSlide.members]; members[i] = { ...members[i], name: v }; update({ members });
                }} />
                <Field label="Role" value={member.role} onChange={(v) => {
                  const members = [...teamSlide.members]; members[i] = { ...members[i], role: v }; update({ members });
                }} />
                <MemberImageUpload
                  imageUrl={member.imageUrl}
                  onUpdate={(url) => {
                    const members = [...teamSlide.members]; members[i] = { ...members[i], imageUrl: url }; update({ members });
                  }}
                />
              </div>
            ))}
          </>
        );
      }

      default:
        return null;
    }
  };

  const slideTypeLabel = () => {
    switch (slide.type) {
      case 'cover': return 'Cover Slide';
      case 'section': return 'Section Slide';
      case 'diagram': return 'Diagram Slide';
      case 'stats': return 'Stats Slide';
      case 'content': return 'Content Slide';
      case 'back-cover': return 'Back Cover';
      case 'hero': return 'Hero Slide';
      case 'agenda': return 'Agenda';
      case 'quote': return 'Quote';
      case 'three-col': return '3 Columns';
      case 'feature-list': return 'Feature List';
      case 'customer-story': return 'Customer Story';
      case 'checklist': return 'Checklist';
      case 'big-quote': return 'Big Quote';
      case 'two-col-media': return '2 Col + Media';
      case 'contact': return 'Contact';
      case 'team': return 'Team';
      default: return 'Slide';
    }
  };

  return (
    <div
      className="no-print"
      style={{
        width: 280,
        height: '100%',
        background: '#141414',
        borderLeft: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #2a2a2a',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: '"Saans Mono", monospace',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 4,
          }}
        >
          Edit
        </div>
        <div
          style={{
            fontFamily: '"Saans", sans-serif',
            fontSize: 14,
            fontWeight: 500,
            color: '#F8FFFA',
          }}
        >
          {slideTypeLabel()}
        </div>
      </div>

      {/* Fields */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        {/* Color mode pickers */}
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #2a2a2a' }}>
          {/* Deck-wide color mode */}
          <label style={labelStyle}>Deck Color</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 16 }}>
            {(Object.values(THEMES) as typeof THEMES[ColorMode][]).map((t) => (
              <button
                key={t.id}
                onClick={() => onColorModeChange(t.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  border: `1px solid ${colorMode === t.id ? t.accent : '#2a2a2a'}`,
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  transition: 'border-color 0.15s',
                  background: colorMode === t.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', height: 12, overflow: 'hidden' }}>
                  <div style={{ flex: 2, background: t.darkBg }} />
                  <div style={{ flex: 3, background: t.lightBg }} />
                  <div style={{ width: 4, background: t.accent, flexShrink: 0 }} />
                </div>
                <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colorMode === t.id ? t.accent : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.label}
                </div>
              </button>
            ))}
          </div>

          {/* Per-slide color override */}
          <label style={labelStyle}>This Slide</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
            {/* "Default" option */}
            <button
              onClick={() => onSlideColorModeChange(undefined)}
              title="Use deck color"
              style={{
                all: 'unset',
                cursor: 'pointer',
                border: `1px solid ${slideColorMode === undefined ? 'rgba(255,255,255,0.5)' : '#2a2a2a'}`,
                padding: '7px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                transition: 'border-color 0.15s',
                background: slideColorMode === undefined ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', height: 12, width: '100%', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1 }}>—</span>
              </div>
              <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 7, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: slideColorMode === undefined ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}>
                Default
              </div>
            </button>
            {/* Color options */}
            {(Object.values(THEMES) as typeof THEMES[ColorMode][]).map((t) => (
              <button
                key={t.id}
                onClick={() => onSlideColorModeChange(t.id)}
                title={t.label}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  border: `1px solid ${slideColorMode === t.id ? t.accent : '#2a2a2a'}`,
                  padding: '7px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'border-color 0.15s',
                  background: slideColorMode === t.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', height: 12, width: '100%', overflow: 'hidden' }}>
                  <div style={{ flex: 1, background: t.darkBg }} />
                  <div style={{ flex: 1, background: t.accent }} />
                </div>
                <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 7, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: slideColorMode === t.id ? t.accent : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
                  {t.id.charAt(0).toUpperCase() + t.id.slice(1)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logo toggle */}
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #2a2a2a' }}>
          <label style={labelStyle}>Logo</label>
          <button
            onClick={() => update({ hideLogo: !slide.hideLogo })}
            style={{
              all: 'unset',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                background: !slide.hideLogo ? '#008c44' : '#2a2a2a',
                position: 'relative',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: !slide.hideLogo ? 18 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.15s',
                }}
              />
            </div>
            <AirOpsLogo width={48} color={!slide.hideLogo ? '#008c44' : 'rgba(255,255,255,0.2)'} />
          </button>
        </div>

        {/* Image upload + Giphy (for slides that support it) */}
        {(slide.type === 'cover' || slide.type === 'quote' || slide.type === 'big-quote' || slide.type === 'two-col-media') && (
          <>
            <ImageSection
              imageUrl={(slide as { imageUrl?: string }).imageUrl}
              onUpdate={(url) => update({ imageUrl: url } as Partial<SlideData>)}
            />
            <GiphySearch onSelect={(url) => update({ imageUrl: url } as Partial<SlideData>)} />
          </>
        )}

        {/* Brandfetch logo overlay */}
        <BrandfetchSection
          logos={(slide as { logos?: LogoOverlay[] }).logos ?? []}
          onUpdate={(logos) => update({ logos } as Partial<SlideData>)}
        />

        {panelContent()}
      </div>
    </div>
  );
}
