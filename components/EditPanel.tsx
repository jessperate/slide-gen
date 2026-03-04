'use client';

import { SlideData, DiagramSlideData, StatsSlideData, ContentSlideData } from '@/lib/slides';

interface Props {
  slide: SlideData;
  onChange: (updated: SlideData) => void;
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

export default function EditPanel({ slide, onChange }: Props) {
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
                <div
                  style={{
                    fontFamily: '"Saans Mono", monospace',
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)',
                    marginBottom: 12,
                  }}
                >
                  Column {i + 1}
                </div>
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
                <div
                  style={{
                    fontFamily: '"Saans Mono", monospace',
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)',
                    marginBottom: 12,
                  }}
                >
                  Metric {i + 1}
                </div>
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
                <div
                  style={{
                    fontFamily: '"Saans Mono", monospace',
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)',
                    marginBottom: 12,
                  }}
                >
                  Column {i + 1}
                </div>
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
        {panelContent()}
      </div>
    </div>
  );
}
