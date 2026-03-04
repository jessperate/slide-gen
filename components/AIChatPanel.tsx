'use client';

import { useState, useRef, useEffect } from 'react';
import { SlideData } from '@/lib/slides';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Human-readable summary shown in the UI instead of raw JSON */
  summary?: string;
}

interface AIChatPanelProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
}

export default function AIChatPanel({ slide, onUpdate }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clear history when switching slides
  const slideId = slide.id;
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [slideId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Build history in the format the API expects (raw JSON responses as assistant turns)
    const history = messages.map((m) => ({
      role: m.role,
      content: m.role === 'assistant' ? m.content : m.content,
    }));

    try {
      const res = await fetch('/api/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slide, message: text, history }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const updatedSlide = data.slide as SlideData;
      onUpdate(updatedSlide);

      // Build a human-readable summary of what changed
      const summary = diffSummary(slide, updatedSlide);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: JSON.stringify(updatedSlide),
        summary,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong');
      // Remove the user message so they can retry
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: '"Saans", sans-serif',
      background: '#0a0a0a',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px 10px',
        borderBottom: '1px solid #1e1e1e',
        fontSize: 11,
        fontFamily: '"Saans Mono", monospace',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ color: '#00ff64', fontSize: 14 }}>✦</span>
        AI Edit
      </div>

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div style={{ padding: '12px 16px', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.06em' }}>
            Try asking:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); inputRef.current?.focus(); }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #222',
                  color: 'rgba(255,255,255,0.55)',
                  borderRadius: 6,
                  padding: '7px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: '"Saans", sans-serif',
                  lineHeight: 1.4,
                  transition: 'border-color 0.12s, color 0.12s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,100,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#F8FFFA';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#222';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message history */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '90%',
              padding: '8px 11px',
              borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              background: msg.role === 'user' ? 'rgba(0,255,100,0.1)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(0,255,100,0.25)' : '#222'}`,
              fontSize: 12.5,
              color: msg.role === 'user' ? '#c8ffe0' : '#F8FFFA',
              lineHeight: 1.5,
            }}>
              {msg.role === 'assistant' ? (msg.summary || 'Done.') : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '10px 10px 10px 2px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid #222',
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        {error && (
          <div style={{ fontSize: 11.5, color: '#ff6464', padding: '4px 2px' }}>
            {error} — please try again.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #1e1e1e', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a change…"
            rows={2}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              color: '#F8FFFA',
              fontSize: 12.5,
              fontFamily: '"Saans", sans-serif',
              padding: '8px 10px',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
            }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,255,100,0.4)'; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = '#2a2a2a'; }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? '#00ff64' : 'rgba(255,255,255,0.07)',
              border: 'none',
              borderRadius: 8,
              color: input.trim() && !loading ? '#002910' : 'rgba(255,255,255,0.25)',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              padding: '8px 14px',
              fontSize: 14,
              fontWeight: 700,
              transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
              lineHeight: 1,
              alignSelf: 'stretch',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ↑
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 5, paddingLeft: 2 }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(0,255,100,0.6)',
            display: 'inline-block',
            animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`@keyframes blink { 0%,80%,100%{opacity:0.15} 40%{opacity:1} }`}</style>
    </span>
  );
}

/** Produce a short human-readable summary of what changed between two slides */
function diffSummary(before: SlideData, after: SlideData): string {
  const b = before as unknown as Record<string, unknown>;
  const a = after as unknown as Record<string, unknown>;
  const changes: string[] = [];

  if (b.type !== a.type) changes.push(`Changed layout to ${a.type}`);
  if (b.headline !== a.headline && a.headline) changes.push(`Updated headline`);
  if (b.eyebrow !== a.eyebrow && a.eyebrow) changes.push(`Updated eyebrow`);
  if (b.subheadline !== a.subheadline && a.subheadline) changes.push(`Updated subheadline`);
  if (b.body !== a.body && a.body) changes.push(`Updated body copy`);
  if (b.quote !== a.quote && a.quote) changes.push(`Updated quote`);
  if (b.attribution !== a.attribution) changes.push(`Updated attribution`);
  if (b.thesis !== a.thesis) changes.push(`Updated thesis`);
  if (b.cta !== a.cta) changes.push(`Updated CTA`);
  if (JSON.stringify(b.columns) !== JSON.stringify(a.columns)) changes.push(`Updated columns`);
  if (JSON.stringify(b.items) !== JSON.stringify(a.items)) changes.push(`Updated items`);
  if (JSON.stringify(b.metrics) !== JSON.stringify(a.metrics)) changes.push(`Updated metrics`);

  if (changes.length === 0) return 'Done — no visible changes detected.';
  return changes.join(' · ') + '.';
}

const SUGGESTIONS = [
  'Make the headline more compelling',
  'Rewrite the body copy to be more specific',
  'Change this to a section slide',
  'Add 3 bullet points about our key benefits',
  'Make the tone more confident and direct',
];
