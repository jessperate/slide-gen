'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SlideData, defaultSlides } from '@/lib/slides';
import { ColorMode, THEMES, DEFAULT_THEME } from '@/lib/themes';
import LZString from 'lz-string';
import ThumbnailRail from '@/components/ThumbnailRail';
import EditPanel from '@/components/EditPanel';
import AIChatPanel from '@/components/AIChatPanel';
import AddSlideModal from '@/components/AddSlideModal';
import OnboardingScreen from '@/components/OnboardingScreen';
import AirOpsLogo from '@/components/AirOpsLogo';
import { renderSlide, LogoLayer } from '@/components/SlideCanvas';
import { LogoOverlay } from '@/lib/slides';
import RemixBar from '@/components/RemixBar';
import RecentDecksModal from '@/components/RecentDecksModal';
import FloatingFontSizer from '@/components/FloatingFontSizer';
import { getOrCreateDeckId, setCurrentDeckId, upsertHistory, deckName, DeckEntry } from '@/lib/deckHistory';

const STORAGE_KEY = 'slidegen-current-deck';
const SAVED_KEY = 'slidegen-saved-deck';
const NOTES_KEY = 'slidegen-notes';
const THEME_KEY = 'slidegen-theme';
const SLIDE_COLORS_KEY = 'slidegen-slide-colors';
const VIEWER_NAME_KEY = 'slidegen-viewer-name';
const IMG_KEY_PREFIX = 'slidegen-img-';
const OVERLAY_KEY_PREFIX = 'slidegen-overlay-';

/** Save base64 images to individual per-slide keys so they don't bloat the main autosave. */
function saveImageAssets(slides: SlideData[]) {
  for (const s of slides) {
    const rec = s as unknown as Record<string, unknown>;
    if (typeof rec.imageUrl === 'string' && (rec.imageUrl as string).startsWith('data:')) {
      try { localStorage.setItem(`${IMG_KEY_PREFIX}${s.id}`, rec.imageUrl as string); } catch {}
    }
    const overlays = rec.imageOverlays as Array<{ id: string; url: string }> | undefined;
    if (Array.isArray(overlays)) {
      for (const o of overlays) {
        if (typeof o.url === 'string' && o.url.startsWith('data:')) {
          try { localStorage.setItem(`${OVERLAY_KEY_PREFIX}${s.id}-${o.id}`, o.url); } catch {}
        }
      }
    }
  }
}

/** Re-attach saved base64 images to slides that don't already have an inline imageUrl. */
function restoreImageAssets(slides: SlideData[]): SlideData[] {
  return slides.map((s) => {
    const rec = s as unknown as Record<string, unknown>;
    let result = s;
    if (!rec.imageUrl) {
      const img = localStorage.getItem(`${IMG_KEY_PREFIX}${s.id}`);
      if (img) result = { ...result, imageUrl: img } as SlideData;
    }
    const overlays = (rec.imageOverlays as Array<{ id: string; url: string }> | undefined) ?? [];
    const restoredOverlays = overlays.map((o) => {
      if (!o.url) {
        const saved = localStorage.getItem(`${OVERLAY_KEY_PREFIX}${s.id}-${o.id}`);
        if (saved) return { ...o, url: saved };
      }
      return o;
    });
    if (restoredOverlays.length > 0) result = { ...result, imageOverlays: restoredOverlays } as unknown as SlideData;
    return result;
  });
}

/** Strip base64 imageUrls before storing in STORAGE_KEY / deck history to avoid quota issues. */
function stripImageUrls(slides: SlideData[]): SlideData[] {
  return slides.map((s) => {
    const rec = s as unknown as Record<string, unknown>;
    let result = s;
    if (typeof rec.imageUrl === 'string' && (rec.imageUrl as string).startsWith('data:')) {
      result = { ...result, imageUrl: undefined } as SlideData;
    }
    const overlays = rec.imageOverlays as Array<{ id: string; url: string }> | undefined;
    if (Array.isArray(overlays) && overlays.some((o) => o.url?.startsWith('data:'))) {
      result = {
        ...result,
        imageOverlays: overlays.map((o) => o.url?.startsWith('data:') ? { ...o, url: '' } : o),
      } as unknown as SlideData;
    }
    return result;
  });
}

/**
 * One-time purge: remove base64 images from any existing localStorage entries
 * (history, saved deck) that were written before the per-slide image key approach.
 * Call this before loading slides so there is free quota for saveImageAssets.
 */
function purgeStorageBloat() {
  const HISTORY_KEY = 'slidegen-deck-history';
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const history = JSON.parse(raw) as Array<{ slides?: unknown[] }>;
      const cleaned = history.map((d) => ({ ...d, slides: stripImageUrls((d.slides ?? []) as SlideData[]) }));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(cleaned));
    }
  } catch {
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  }
  // Strip base64 from the "saved deck" backup too
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SlideData[];
      if (Array.isArray(parsed)) {
        localStorage.setItem(SAVED_KEY, JSON.stringify(stripImageUrls(parsed)));
      }
    }
  } catch {}
}

interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface SlideComment {
  id: string;
  slideId: string;
  x: number; // % of slide width
  y: number; // % of slide height
  text: string;
  author: string;
  createdAt: string;
  resolved?: boolean;
  replies?: CommentReply[];
}

/** Floating toolbar that appears above selected text to insert/remove hyperlinks */
function LinkToolbar() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [inLink, setInLink] = useState(false);

  useEffect(() => {
    const onSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { setPos(null); return; }
      const range = sel.getRangeAt(0);
      // Only show if selection is inside a contentEditable element
      let el: Node | null = range.commonAncestorContainer;
      if (el.nodeType === Node.TEXT_NODE) el = el.parentElement;
      let editable = false;
      let node: Element | null = el as Element | null;
      while (node) {
        if ((node as HTMLElement).isContentEditable) { editable = true; break; }
        node = node.parentElement;
      }
      if (!editable) { setPos(null); return; }
      const rect = range.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
      // Check if cursor is inside a link
      let n: Node | null = range.commonAncestorContainer;
      if (n.nodeType === Node.TEXT_NODE) n = n.parentElement;
      let insideLink = false;
      let check: Element | null = n as Element | null;
      while (check) { if (check.tagName === 'A') { insideLink = true; break; } check = check.parentElement; }
      setInLink(insideLink);
    };
    document.addEventListener('selectionchange', onSelection);
    return () => document.removeEventListener('selectionchange', onSelection);
  }, []);

  if (!pos) return null;

  const insertLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.prompt('Enter URL:', 'https://');
    if (!url) return;
    document.execCommand('createLink', false, url);
    // Make the created link open in a new tab
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const a = sel.getRangeAt(0).commonAncestorContainer.parentElement?.closest('a');
      if (a) a.setAttribute('target', '_blank');
    }
    setPos(null);
  };

  const removeLink = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('unlink');
    setPos(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -100%)',
        background: '#111',
        border: '1px solid #333',
        borderRadius: 6,
        display: 'flex',
        gap: 1,
        overflow: 'hidden',
        zIndex: 9999,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        pointerEvents: 'auto',
      }}
    >
      <button
        onMouseDown={insertLink}
        style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: '#008c44', fontSize: 12, fontFamily: '"Saans", sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        🔗 {inLink ? 'Edit link' : 'Add link'}
      </button>
      {inLink && (
        <button
          onMouseDown={removeLink}
          style={{ padding: '6px 10px', background: 'transparent', border: 'none', borderLeft: '1px solid #333', color: '#888', fontSize: 12, fontFamily: '"Saans", sans-serif', cursor: 'pointer' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function SlideGenPage() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('slidegen-current-deck'); } catch { return true; }
  });
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
  const [hasSavedDeck, setHasSavedDeck] = useState(false);
  const [googleSetupNeeded, setGoogleSetupNeeded] = useState(false);
  const [gslidesUrl, setGslidesUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [presenting, setPresenting] = useState(false);
  const [presentIndex, setPresentIndex] = useState(0);
  const [presentScale, setPresentScale] = useState(1);
  const [showPresentControls, setShowPresentControls] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>('green');
  const [slideColorOverrides, setSlideColorOverrides] = useState<Record<string, ColorMode>>({});
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [comments, setComments] = useState<SlideComment[]>([]);
  const [viewerName, setViewerName] = useState('');
  const [commentMode, setCommentMode] = useState(false);
  const [pendingCommentPos, setPendingCommentPos] = useState<{ x: number; y: number } | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInputValue, setNameInputValue] = useState('');
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [preRemixSlides, setPreRemixSlides] = useState<Record<string, SlideData>>({});
  const [chatMode, setChatMode] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [focusedField, setFocusedField] = useState<{ key: string; rect: DOMRect } | null>(null);
  const deckIdRef = useRef<string>('');

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const presentContainerRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const activeSlide = slides[activeIndex];

  // Restore autosaved deck + notes on mount
  useEffect(() => {
    // Free up localStorage quota by removing old base64 blobs before reading/writing anything
    purgeStorageBloat();
    deckIdRef.current = getOrCreateDeckId();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(restoreImageAssets(parsed));
          // Onboarding always shows on landing — user can skip to continue previous deck
        }
      }
      const savedNotes = localStorage.getItem(NOTES_KEY);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      setHasSavedDeck(!!localStorage.getItem(SAVED_KEY));
      const savedTheme = localStorage.getItem(THEME_KEY) as ColorMode | null;
      if (savedTheme && THEMES[savedTheme]) setColorMode(savedTheme);
      const savedSlideColors = localStorage.getItem(SLIDE_COLORS_KEY);
      if (savedSlideColors) setSlideColorOverrides(JSON.parse(savedSlideColors));
      const savedName = localStorage.getItem(VIEWER_NAME_KEY) ?? '';
      if (savedName) setViewerName(savedName);
    } catch {}
  }, []);

  // Load shared deck from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#s=')) return;
    try {
      const json = LZString.decompressFromEncodedURIComponent(hash.slice(3));
      if (!json) return;
      const state = JSON.parse(json);
      if (Array.isArray(state.slides) && state.slides.length > 0) {
        setSlides(restoreImageAssets(state.slides));
        setShowOnboarding(false);
      }
      if (state.colorMode && THEMES[state.colorMode as ColorMode]) setColorMode(state.colorMode);
      if (state.slideColorOverrides) setSlideColorOverrides(state.slideColorOverrides);
      if (Array.isArray(state.comments)) setComments(state.comments);
      // Auto-enter present mode if link includes ?present=1
      if (new URLSearchParams(window.location.search).get('present') === '1') {
        setPresentIndex(0);
        setShowPresentControls(false);
        setPresenting(true);
      }
    } catch { /* ignore malformed hash */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave slides + upsert into deck history
  useEffect(() => {
    // 1. Clean history first — this frees quota by stripping any old base64 blobs
    if (deckIdRef.current && slides.length > 0) {
      upsertHistory({
        id: deckIdRef.current,
        name: deckName(slides),
        lastModified: Date.now(),
        slides: stripImageUrls(slides),
        colorMode,
        slideColorOverrides,
      });
    }
    // 2. Now save images to per-slide keys (quota should be available)
    saveImageAssets(slides);
    // 3. Save main deck without base64 blobs
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stripImageUrls(slides))); } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  // Autosave notes
  useEffect(() => {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);

  // Autosave theme
  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, colorMode); } catch {}
  }, [colorMode]);

  // Autosave slide color overrides
  useEffect(() => {
    try { localStorage.setItem(SLIDE_COLORS_KEY, JSON.stringify(slideColorOverrides)); } catch {}
  }, [slideColorOverrides]);

  // Canvas scale
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const padding = 48;
      const scaleX = (width - padding * 2) / 1280;
      const scaleY = (height - padding * 2) / 720;
      setCanvasScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Presentation scale — fits viewport
  useEffect(() => {
    if (!presenting) return;
    const update = () => {
      const scaleX = window.innerWidth / 1280;
      const scaleY = window.innerHeight / 720;
      setPresentScale(Math.min(scaleX, scaleY));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [presenting]);

  // Keyboard nav in presentation mode
  const handlePresentKey = useCallback((e: KeyboardEvent) => {
    if (!presenting) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPresentIndex((i) => Math.min(slides.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPresentIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Escape') {
      setPresenting(false);
      document.exitFullscreen?.().catch(() => {});
    } else if (e.key === 'n' || e.key === 'N') {
      setShowNotesPanel((v) => !v);
    }
  }, [presenting, slides.length]);

  useEffect(() => {
    window.addEventListener('keydown', handlePresentKey);
    return () => window.removeEventListener('keydown', handlePresentKey);
  }, [handlePresentKey]);

  const startPresentation = () => {
    setPresentIndex(activeIndex);
    setShowPresentControls(false);
    setPresenting(true);
    presentContainerRef.current?.requestFullscreen?.().catch(() => {});
  };

  const handleGenerate = (rawSlides: unknown[]) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(slides));
      setHasSavedDeck(true);
    } catch {}
    setSlides(rawSlides as SlideData[]);
    setActiveIndex(0);
    setShowOnboarding(false);
  };

  const handleSkip = () => setShowOnboarding(false);

  const handleRestoreSaved = () => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(SAVED_KEY, JSON.stringify(slides));
        setSlides(parsed);
        setActiveIndex(0);
      }
    } catch {}
  };

  const updateSlide = (updated: SlideData) => {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const updateActiveSlide = (updates: Partial<SlideData>) => {
    setSlides((prev) =>
      prev.map((s, i) => i === activeIndex ? ({ ...s, ...updates } as SlideData) : s),
    );
  };

  const handleRemix = (remixed: SlideData) => {
    const originalId = activeSlide?.id;
    if (!originalId) return;
    setPreRemixSlides((prev) => prev[originalId] ? prev : { ...prev, [originalId]: activeSlide });
    setSlides((prev) => prev.map((s, i) => i === activeIndex ? remixed : s));
  };

  const handleRevert = () => {
    const original = preRemixSlides[activeSlide?.id ?? ''];
    if (!original) return;
    setSlides((prev) => prev.map((s, i) => i === activeIndex ? original : s));
    setPreRemixSlides((prev) => { const next = { ...prev }; delete next[original.id]; return next; });
  };

  const addSlide = (newSlide: SlideData) => {
    setSlides((prev) => {
      const next = [...prev];
      next.splice(activeIndex + 1, 0, newSlide);
      return next;
    });
    setActiveIndex(activeIndex + 1);
  };

  const handleGoogleSlides = async () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setGoogleSetupNeeded(true);
      return;
    }
    setGslidesUrl(null);
    setExportProgress({ current: 0, total: slides.length });
    try {
      // Screenshot each slide at 1280×720 into an off-screen container
      const [html2canvasModule, { createRoot }] = await Promise.all([
        import('html2canvas'),
        import('react-dom/client'),
      ]);
      const html2canvas = html2canvasModule.default;

      const container = document.createElement('div');
      container.style.cssText =
        'position:fixed;left:-9999px;top:0;width:1280px;height:720px;overflow:hidden;pointer-events:none;z-index:-1;';
      document.body.appendChild(container);
      const root = createRoot(container);

      const pngDataUrls: string[] = [];
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const theme = getSlideTheme(slide);
        // Render the slide (non-interactive) into the off-screen div
        await new Promise<void>((resolve) => {
          root.render(
            <div style={{ width: 1280, height: 720, position: 'relative', overflow: 'hidden' }}>
              {renderSlide(slide, false, () => {}, theme)}
              <LogoLayer
                logos={(slide as { logos?: LogoOverlay[] }).logos ?? []}
                scale={1}
                interactive={false}
              />
            </div>,
          );
          // Give fonts + images time to render
          setTimeout(resolve, 150);
        });

        const canvas = await html2canvas(container, {
          width: 1280,
          height: 720,
          scale: 1,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });
        pngDataUrls.push(canvas.toDataURL('image/png'));
        setExportProgress({ current: i + 1, total: slides.length });
      }

      root.unmount();
      document.body.removeChild(container);

      const { buildScreenshotPptxBlob } = await import('@/lib/exportPptxNative');
      const pptxBlob = await buildScreenshotPptxBlob(pngDataUrls);

      const { openInGoogleSlides } = await import('@/lib/googleSlides');
      const url = await openInGoogleSlides(pptxBlob, deckName(slides));
      setGslidesUrl(url);
    } catch (err) {
      console.error(err);
      alert(`Google Slides export failed:\n\n${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExportProgress(null);
    }
  };

  const activeSlideComments = comments.filter((c) => c.slideId === activeSlide?.id);

  const submitComment = () => {
    if (!pendingCommentPos || !commentInput.trim() || !viewerName || !activeSlide) return;
    const newComment: SlideComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      slideId: activeSlide.id,
      x: pendingCommentPos.x,
      y: pendingCommentPos.y,
      text: commentInput.trim(),
      author: viewerName,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setPendingCommentPos(null);
    setCommentInput('');
  };

  const submitReply = (commentId: string) => {
    if (!replyInput.trim() || !viewerName) return;
    const reply: CommentReply = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: viewerName,
      text: replyInput.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => prev.map((c) =>
      c.id === commentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c
    ));
    setReplyInput('');
    setReplyingToId(null);
  };

  const toggleResolved = (commentId: string) => {
    setComments((prev) => prev.map((c) =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    ));
  };

  const confirmName = () => {
    const name = nameInputValue.trim();
    if (!name) return;
    setViewerName(name);
    try { localStorage.setItem(VIEWER_NAME_KEY, name); } catch {}
    setShowNamePrompt(false);
    setNameInputValue('');
    // pendingCommentPos is already set, input will appear
  };

  const theme = THEMES[colorMode] ?? DEFAULT_THEME;
  const getSlideTheme = (slide: SlideData) => THEMES[slideColorOverrides[slide.id] ?? colorMode] ?? theme;
  const activeSlideTheme = activeSlide ? getSlideTheme(activeSlide) : theme;
  const slideWidth = Math.round(1280 * canvasScale);
  const slideHeight = Math.round(720 * canvasScale);
  const activeNote = activeSlide ? (notes[activeSlide.id] ?? '') : '';

  return (
    <>
      {showOnboarding && (
        <OnboardingScreen onGenerate={handleGenerate} onSkip={handleSkip} />
      )}

      {/* Print output */}
      <div style={{ display: 'none' }} className="print-output">
        {slides.map((slide) => (
          <div key={slide.id} className="slide-for-print"
            style={{ width: 1280, height: 720, position: 'relative', overflow: 'hidden' }}>
            {renderSlide(slide, false, undefined, getSlideTheme(slide))}
          </div>
        ))}
      </div>

      {/* ── Presentation mode ── */}
      {presenting && (
        <div
          ref={presentContainerRef}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000000',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setPresentIndex((i) => Math.min(slides.length - 1, i + 1))}
          onMouseMove={() => setShowPresentControls(true)}
          onMouseLeave={() => setShowPresentControls(false)}
        >
          {/* Slide */}
          <div
            style={{
              width: Math.round(1280 * presentScale),
              height: Math.round(720 * presentScale),
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                transformOrigin: 'top left',
                transform: `scale(${presentScale})`,
                width: 1280,
                height: 720,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {renderSlide(slides[presentIndex], false, undefined, getSlideTheme(slides[presentIndex]))}
            </div>
          </div>

          {/* Exit button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPresenting(false);
              document.exitFullscreen?.().catch(() => {});
            }}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backdropFilter: 'blur(8px)',
              opacity: showPresentControls ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: showPresentControls ? 'auto' : 'none',
            }}
          >
            ✕ Exit
          </button>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); setPresentIndex((i) => Math.max(0, i - 1)); }}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: presentIndex === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 18,
              cursor: presentIndex === 0 ? 'default' : 'pointer',
              padding: '10px 14px',
              backdropFilter: 'blur(8px)',
              lineHeight: 1,
              opacity: showPresentControls ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: showPresentControls ? 'auto' : 'none',
            }}
          >
            ←
          </button>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); setPresentIndex((i) => Math.min(slides.length - 1, i + 1)); }}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: presentIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontFamily: '"Saans", sans-serif',
              fontSize: 18,
              cursor: presentIndex === slides.length - 1 ? 'default' : 'pointer',
              padding: '10px 14px',
              backdropFilter: 'blur(8px)',
              lineHeight: 1,
              opacity: showPresentControls ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: showPresentControls ? 'auto' : 'none',
            }}
          >
            →
          </button>

          {/* Slide counter bar at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '10px 20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Counter */}
            <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
              {presentIndex + 1} / {slides.length}
            </div>

            {/* Dot progress */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1 }}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPresentIndex(i); }}
                  style={{
                    width: i === presentIndex ? 16 : 4,
                    height: 4,
                    background: i === presentIndex ? '#00ff64' : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'width 0.2s, background 0.2s',
                  }}
                />
              ))}
            </div>

            {/* Notes toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowNotesPanel((v) => !v); }}
              style={{
                background: showNotesPanel ? 'rgba(0,255,100,0.15)' : 'transparent',
                border: `1px solid ${showNotesPanel ? '#00ff64' : 'rgba(255,255,255,0.15)'}`,
                color: showNotesPanel ? '#00ff64' : 'rgba(255,255,255,0.5)',
                fontFamily: '"Saans Mono", monospace',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                padding: '4px 10px',
                flexShrink: 0,
              }}
            >
              NOTES  [N]
            </button>
          </div>

          {/* Floating speaker notes panel */}
          {showNotesPanel && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: 52,
                right: 24,
                width: 380,
                maxHeight: 280,
                background: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(0,255,100,0.25)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 600,
              }}
            >
              {/* Panel header */}
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: '"Saans Mono", monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#00ff64', textTransform: 'uppercase' }}>
                  Speaker Notes — Slide {presentIndex + 1}
                </span>
                <button
                  onClick={() => setShowNotesPanel(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
                >
                  ✕
                </button>
              </div>

              {/* Notes content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
                {notes[slides[presentIndex]?.id] ? (
                  <div style={{
                    fontFamily: '"Saans", sans-serif',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {notes[slides[presentIndex].id]}
                  </div>
                ) : (
                  <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No notes for this slide
                  </div>
                )}
              </div>

              {/* Prev / Next slide preview */}
              {presentIndex < slides.length - 1 && notes[slides[presentIndex + 1]?.id] && (
                <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                  <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Up next
                  </div>
                  <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {notes[slides[presentIndex + 1].id]}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Main editor UI ── */}
      <div
        className="no-print"
        style={{
          display: 'grid',
          gridTemplateRows: '52px 1fr 120px 48px',
          gridTemplateColumns: '200px 1fr 280px',
          gridTemplateAreas: `
            "topbar topbar topbar"
            "rail canvas panel"
            "rail notes panel"
            "rail bottombar panel"
          `,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: '#1a1a1a',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            gridArea: 'topbar',
            background: '#111111',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            height: 52,
            gap: 12,
            flexShrink: 0,
            overflowX: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <AirOpsLogo color="#008c44" width={72} />
            <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />
            <div style={{ fontFamily: '"Saans", sans-serif', fontSize: 14, fontWeight: 500, color: '#F8FFFA' }}>
              SlideGen
            </div>
          </div>

          <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}>
            {activeIndex + 1} / {slides.length}
          </div>

          {/* ▶ Present button */}
          <button
            onClick={startPresentation}
            style={{
              background: theme.accent,
              border: 'none',
              color: theme.darkBg,
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '7px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#00ff64')}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1L9 6L1 11V1Z" fill="currentColor" />
            </svg>
            Present
          </button>

          <div style={{ width: 1, height: 20, background: '#2a2a2a' }} />

          {/* Comment toggle — right after Present so it's always visible */}
          <button
            onClick={() => {
              const next = !commentMode;
              setCommentMode(next);
              if (next) setChatMode(false);
              if (!next) { setPendingCommentPos(null); setCommentInput(''); }
            }}
            style={{
              background: commentMode ? '#002910' : 'transparent',
              border: `1px solid ${commentMode ? '#00ff64' : '#2a2a2a'}`,
              color: commentMode ? '#00ff64' : 'rgba(255,255,255,0.5)',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', padding: '5px 12px',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {commentMode ? '● ' : ''}Comment{comments.length > 0 ? ` (${comments.length})` : ''}
          </button>

          <button
            onClick={() => {
              const next = !chatMode;
              setChatMode(next);
              if (next) setCommentMode(false);
            }}
            style={{
              background: chatMode ? '#001a0a' : 'transparent',
              border: `1px solid ${chatMode ? '#00ff64' : '#2a2a2a'}`,
              color: chatMode ? '#00ff64' : 'rgba(255,255,255,0.5)',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', padding: '5px 12px',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{ fontSize: 13 }}>✦</span> AI Edit
          </button>

          <div style={{ width: 1, height: 20, background: '#2a2a2a' }} />

          {hasSavedDeck && (
            <button
              onClick={handleRestoreSaved}
              title="Swap with your previous deck"
              style={{
                background: 'transparent', border: '1px solid #2a2a2a',
                color: 'rgba(255,255,255,0.4)', fontFamily: '"Saans", sans-serif',
                fontSize: 13, cursor: 'pointer', padding: '5px 12px',
                transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              ↩ Prev
            </button>
          )}

          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: 'rgba(255,255,255,0.5)', fontFamily: '"Saans", sans-serif',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '5px 12px',
              transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            ✦ New
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: '#F8FFFA', fontFamily: '"Saans", sans-serif',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '5px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#F8FFFA'; }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Slide
          </button>

          <button
            onClick={handleGoogleSlides}
            disabled={!!exportProgress}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: exportProgress ? 'rgba(255,255,255,0.3)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: exportProgress ? 'default' : 'pointer', padding: '5px 12px',
              transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!exportProgress) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = exportProgress ? 'rgba(255,255,255,0.3)' : '#F8FFFA'; }}
          >
            {exportProgress ? `Exporting…` : 'GSlides'}
          </button>
          {gslidesUrl && (
            <a
              href={gslidesUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setGslidesUrl(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: '#1a3a1a', border: '1px solid #00cc55',
                color: '#00cc55', borderRadius: 4, padding: '5px 10px',
                fontFamily: '"Saans", sans-serif', fontSize: 12, fontWeight: 500,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              ↗ Open in Google Slides
            </a>
          )}

          <button
            onClick={() => {
              // Full state (with images) → browser history, so returning to the page restores images
              const fullState = { slides, colorMode, slideColorOverrides, comments };
              const fullCompressed = LZString.compressToEncodedURIComponent(JSON.stringify(fullState));
              window.history.replaceState(null, '', `#s=${fullCompressed}`);
              // Strip base64 images from the SHARED URL only — keeps clipboard URL short
              const stripBase64 = (s: SlideData) => {
                const rec = s as unknown as Record<string, unknown>;
                if (typeof rec.imageUrl === 'string' && rec.imageUrl.startsWith('data:')) {
                  return { ...s, imageUrl: undefined } as SlideData;
                }
                return s;
              };
              const shareState = { slides: slides.map(stripBase64), colorMode, slideColorOverrides, comments };
              const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(shareState));
              const url = `${window.location.origin}${window.location.pathname}?present=1#s=${compressed}`;
              navigator.clipboard.writeText(url).then(() => {
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2500);
              });
            }}
            style={{
              background: shareStatus === 'copied' ? '#002910' : 'transparent',
              border: `1px solid ${shareStatus === 'copied' ? '#008c44' : '#2a2a2a'}`,
              color: shareStatus === 'copied' ? '#00ff64' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', padding: '5px 12px',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (shareStatus === 'idle') { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { if (shareStatus === 'idle') { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#F8FFFA'; } }}
          >
            {shareStatus === 'copied' ? '✓ Copied!' : '↗ Share'}
          </button>

          <button
            onClick={() => setShowRecents(true)}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: '#F8FFFA', fontFamily: '"Saans", sans-serif', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', padding: '5px 12px',
              transition: 'border-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; }}
          >
            Recents
          </button>

          <button
            onClick={async () => {
              if (exportProgress) return;
              setExportProgress({ current: 0, total: slides.length });
              try {
                const { exportToPdf } = await import('@/lib/exportPdf');
                await exportToPdf(
                  slides,
                  (s, interactive) => renderSlide(s, interactive, undefined, getSlideTheme(s)),
                  (current, total) => setExportProgress({ current, total }),
                );
              } catch (err) {
                console.error(err);
              } finally {
                setExportProgress(null);
              }
            }}
            disabled={!!exportProgress}
            style={{
              background: exportProgress ? '#005c2d' : '#008c44',
              border: `1px solid ${exportProgress ? '#005c2d' : '#008c44'}`,
              color: 'white',
              fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500,
              cursor: exportProgress ? 'default' : 'pointer', padding: '5px 14px', transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!exportProgress) { (e.currentTarget as HTMLButtonElement).style.background = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#002910'; } }}
            onMouseLeave={(e) => { if (!exportProgress) { (e.currentTarget as HTMLButtonElement).style.background = '#008c44'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#008c44'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; } }}
          >
            {exportProgress ? `PDF ${exportProgress.current}/${exportProgress.total}…` : '↓ Export PDF'}
          </button>
        </div>

        {/* Thumbnail rail */}
        <div style={{ gridArea: 'rail', overflow: 'hidden' }}>
          <ThumbnailRail
            slides={slides}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            onReorder={(newSlides) => {
              const activeId = slides[activeIndex]?.id;
              setSlides(newSlides);
              const newIdx = newSlides.findIndex((s) => s.id === activeId);
              if (newIdx >= 0) setActiveIndex(newIdx);
            }}
            onDelete={(index) => {
              if (slides.length <= 1) return;
              const next = slides.filter((_, i) => i !== index);
              setSlides(next);
              setActiveIndex(Math.min(activeIndex, next.length - 1));
            }}
            theme={theme}
            slideColorOverrides={slideColorOverrides}
          />
        </div>

        {/* Floating link toolbar — shown when text is selected in a slide contentEditable */}
        {!commentMode && !presenting && <LinkToolbar />}

        {/* Per-field font sizer */}
        {focusedField && activeSlide && !commentMode && (
          <FloatingFontSizer
            fieldKey={focusedField.key}
            currentScale={(activeSlide as { fontScales?: Record<string, number> }).fontScales?.[focusedField.key] ?? 1}
            anchorRect={focusedField.rect}
            onScale={(scale) => {
              const current = (activeSlide as { fontScales?: Record<string, number> }).fontScales ?? {};
              const updated = Math.abs(scale - 1) < 0.01
                ? Object.fromEntries(Object.entries(current).filter(([k]) => k !== focusedField.key))
                : { ...current, [focusedField.key]: scale };
              updateActiveSlide({ fontScales: updated } as Partial<SlideData>);
            }}
            onClose={() => setFocusedField(null)}
          />
        )}

        {/* Main canvas */}
        <div
          ref={canvasContainerRef}
          style={{
            gridArea: 'canvas', display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 12, background: '#1a1a1a', overflow: 'hidden', position: 'relative',
            cursor: commentMode ? 'crosshair' : 'default',
          }}
        >
          {activeSlide && (
            <div style={{ width: slideWidth, height: slideHeight, position: 'relative', flexShrink: 0, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              {/* Slide content */}
              <div
                style={{ transformOrigin: 'top left', transform: `scale(${canvasScale})`, width: 1280, height: 720, position: 'absolute', top: 0, left: 0 }}
                onFocusCapture={(e) => {
                  const el = e.target as HTMLElement;
                  const key = el.getAttribute('data-fieldkey');
                  if (key) setFocusedField({ key, rect: el.getBoundingClientRect() });
                }}
                onBlurCapture={(e) => {
                  const related = e.relatedTarget as HTMLElement | null;
                  if (!related?.closest?.('[data-font-sizer]')) setFocusedField(null);
                }}
              >
                {renderSlide(activeSlide, !commentMode, updateActiveSlide, activeSlideTheme)}
                <LogoLayer
                  logos={(activeSlide as { logos?: LogoOverlay[] }).logos ?? []}
                  scale={canvasScale}
                  interactive={!commentMode}
                  onUpdate={(logos) => updateActiveSlide({ logos } as Partial<typeof activeSlide>)}
                />
              </div>

              {/* Comment bubbles (in outer div, so they don't scale) */}
              {activeSlideComments.map((comment, idx) => (
                <div
                  key={comment.id}
                  style={{
                    position: 'absolute',
                    left: `${comment.x}%`,
                    top: `${comment.y}%`,
                    transform: 'translate(-50%, -100%)',
                    zIndex: 15,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredCommentId(comment.id)}
                  onMouseLeave={() => setHoveredCommentId(null)}
                >
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50% 50% 50% 0',
                    background: comment.resolved ? '#444' : hoveredCommentId === comment.id ? '#ffffff' : '#00ff64',
                    color: comment.resolved ? '#888' : '#002910',
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Saans Mono", monospace',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    transform: 'rotate(-45deg)',
                    transition: 'background 0.15s',
                  }}>
                    <span style={{ transform: 'rotate(45deg)', display: 'block' }}>{idx + 1}</span>
                  </div>
                  {/* Hover tooltip */}
                  {hoveredCommentId === comment.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '110%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#111',
                      border: '1px solid #2a2a2a',
                      padding: '8px 10px',
                      width: 180,
                      zIndex: 30,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                      pointerEvents: 'none',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#00ff64', fontFamily: '"Saans", sans-serif', marginBottom: 4 }}>{comment.author}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: '"Saans", sans-serif', lineHeight: 1.4 }}>{comment.text}</div>
                    </div>
                  )}
                </div>
              ))}

              {/* Comment mode click overlay */}
              {commentMode && (
                <div
                  style={{ position: 'absolute', inset: 0, cursor: 'crosshair', zIndex: 10 }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    if (!viewerName) {
                      setPendingCommentPos({ x, y });
                      setShowNamePrompt(true);
                    } else {
                      setPendingCommentPos({ x, y });
                      setCommentInput('');
                    }
                  }}
                />
              )}

              {/* Pending comment input popup */}
              {pendingCommentPos && !showNamePrompt && (
                <div
                  style={{
                    position: 'absolute',
                    left: Math.min(pendingCommentPos.x / 100 * slideWidth, slideWidth - 220),
                    top: Math.min(pendingCommentPos.y / 100 * slideHeight + 8, slideHeight - 140),
                    zIndex: 25,
                    background: '#111111',
                    border: '1px solid #2a2a2a',
                    padding: '10px',
                    width: 210,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <textarea
                    autoFocus
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); }
                      if (e.key === 'Escape') { setPendingCommentPos(null); setCommentInput(''); }
                    }}
                    placeholder="Add a comment…"
                    rows={3}
                    style={{
                      width: '100%',
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      color: '#F8FFFA',
                      fontFamily: '"Saans", sans-serif',
                      fontSize: 12,
                      lineHeight: 1.5,
                      padding: '6px 8px',
                      resize: 'none',
                      outline: 'none',
                      caretColor: '#00ff64',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 6 }}>
                    <button
                      onClick={() => { setPendingCommentPos(null); setCommentInput(''); }}
                      style={{ background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.4)', fontFamily: '"Saans", sans-serif', fontSize: 11, cursor: 'pointer', padding: '3px 10px' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitComment}
                      disabled={!commentInput.trim()}
                      style={{ background: commentInput.trim() ? '#008c44' : '#1a1a1a', border: '1px solid #2a2a2a', color: commentInput.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontFamily: '"Saans", sans-serif', fontSize: 11, cursor: commentInput.trim() ? 'pointer' : 'default', padding: '3px 10px' }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Remix bar */}
          {activeSlide && (
            <RemixBar
              slide={activeSlide}
              originalSlide={preRemixSlides[activeSlide.id]}
              onRemix={handleRemix}
              onRevert={preRemixSlides[activeSlide.id] ? handleRevert : undefined}
            />
          )}
        </div>

        {/* Presenter notes */}
        <div
          style={{
            gridArea: 'notes',
            background: '#111111',
            borderTop: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'stretch',
            overflow: 'hidden',
          }}
        >
          {/* Label */}
          <div
            style={{
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              borderRight: '1px solid #2a2a2a',
            }}
          >
            <div
              style={{
                fontFamily: '"Saans Mono", monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Notes
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={notesRef}
            value={activeNote}
            onChange={(e) => {
              if (!activeSlide) return;
              setNotes((prev) => ({ ...prev, [activeSlide.id]: e.target.value }));
            }}
            placeholder="Add presenter notes for this slide…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: '"Saans", sans-serif',
              fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              padding: '14px 20px',
              caretColor: '#00ff64',
            }}
          />

          {/* Notes indicator dot */}
          {activeNote && (
            <div
              style={{
                width: 6,
                height: 6,
                background: '#00ff64',
                borderRadius: '50%',
                position: 'absolute',
                // Will be overlaid on thumbnail — handled in ThumbnailRail ideally
                // Here just show inline with notes label
                alignSelf: 'flex-start',
                margin: '14px 12px',
              }}
            />
          )}
        </div>

        {/* Right panel — edit or comments */}
        <div style={{ gridArea: 'panel', overflow: 'hidden' }}>
          {chatMode && activeSlide ? (
            <AIChatPanel
              slide={activeSlide}
              onUpdate={(updated) => setSlides((prev) => prev.map((s, i) => i === activeIndex ? updated : s))}
            />
          ) : commentMode ? (
            /* Comments panel */
            <div style={{ height: '100%', background: '#0f0f0f', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: '1px solid #2a2a2a' }}>
              {/* Header */}
              <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #2a2a2a', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    Comments
                  </div>
                  {comments.length > 0 && (
                    <button
                      onClick={() => setComments([])}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', fontFamily: '"Saans", sans-serif', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}
                      title="Clear all comments"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff64', flexShrink: 0 }} />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: '"Saans", sans-serif' }}>
                    {viewerName ? (
                      <>Viewing as <span style={{ color: '#00ff64' }}>{viewerName}</span></>
                    ) : 'Click slide to comment'}
                  </div>
                  {viewerName && (
                    <button
                      onClick={() => { setNameInputValue(viewerName); setShowNamePrompt(true); }}
                      style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', fontFamily: '"Saans", sans-serif', fontSize: 10, cursor: 'pointer', padding: '1px 4px' }}
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {/* Comment list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {comments.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: '"Saans", sans-serif', textAlign: 'center', paddingTop: 40, lineHeight: 1.6 }}>
                    Click anywhere on the slide to pin a comment
                  </div>
                ) : (() => {
                  const visibleComments = comments.filter((c) => showResolved || !c.resolved);
                  const resolvedCount = comments.filter((c) => c.resolved).length;
                  return (
                    <>
                      {visibleComments.map((comment, idx) => {
                        const slideIdx = slides.findIndex((s) => s.id === comment.slideId);
                        const isCurrentSlide = comment.slideId === activeSlide?.id;
                        const isReplying = replyingToId === comment.id;
                        return (
                          <div
                            key={comment.id}
                            style={{
                              background: isCurrentSlide ? '#1a1a1a' : '#141414',
                              border: `1px solid ${comment.resolved ? '#1e1e1e' : isCurrentSlide ? '#2a2a2a' : '#1e1e1e'}`,
                              opacity: comment.resolved ? 0.55 : isCurrentSlide ? 1 : 0.7,
                              cursor: isCurrentSlide ? 'default' : 'pointer',
                            }}
                            onClick={() => !isCurrentSlide && setActiveIndex(slideIdx)}
                          >
                            {/* Header row */}
                            <div style={{ padding: '9px 10px 6px', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                              <div style={{
                                width: 16, height: 16, borderRadius: '50% 50% 50% 0',
                                background: comment.resolved ? '#444' : '#00ff64',
                                color: comment.resolved ? '#888' : '#002910',
                                fontSize: 8, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: '"Saans Mono", monospace', transform: 'rotate(-45deg)',
                                flexShrink: 0, marginTop: 1,
                              }}>
                                <span style={{ transform: 'rotate(45deg)', display: 'block' }}>{idx + 1}</span>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: comment.resolved ? 'rgba(255,255,255,0.4)' : '#fff', fontFamily: '"Saans", sans-serif' }}>{comment.author}</span>
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: '"Saans Mono", monospace', marginLeft: 6 }}>Slide {slideIdx + 1}</span>
                                {comment.resolved && <span style={{ fontSize: 10, color: '#008c44', fontFamily: '"Saans Mono", monospace', marginLeft: 6 }}>resolved</span>}
                              </div>
                              {/* Resolve + Delete buttons */}
                              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleResolved(comment.id); }}
                                  title={comment.resolved ? 'Reopen' : 'Resolve'}
                                  style={{ background: comment.resolved ? 'rgba(0,140,68,0.15)' : 'transparent', border: `1px solid ${comment.resolved ? '#008c44' : '#2a2a2a'}`, color: comment.resolved ? '#00ff64' : 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 10, padding: '2px 6px', lineHeight: 1, fontFamily: '"Saans", sans-serif' }}
                                >
                                  {comment.resolved ? '↩' : '✓'}
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setComments((prev) => prev.filter((c) => c.id !== comment.id)); }}
                                  title="Delete"
                                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: 11, padding: '2px 4px', lineHeight: 1 }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {/* Comment text */}
                            <div style={{ fontSize: 12, color: comment.resolved ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.7)', fontFamily: '"Saans", sans-serif', lineHeight: 1.5, padding: '0 10px 8px 33px' }}>
                              {comment.text}
                            </div>

                            {/* Replies */}
                            {(comment.replies ?? []).length > 0 && (
                              <div style={{ borderTop: '1px solid #222', margin: '0 0 0 0' }}>
                                {(comment.replies ?? []).map((reply) => (
                                  <div key={reply.id} style={{ padding: '7px 10px 7px 33px', borderBottom: '1px solid #1a1a1a' }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: '"Saans", sans-serif', marginBottom: 3 }}>↳ {reply.author}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: '"Saans", sans-serif', lineHeight: 1.4 }}>{reply.text}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply input or Reply button */}
                            {!comment.resolved && (
                              <div style={{ borderTop: '1px solid #1e1e1e', padding: '6px 10px' }} onClick={(e) => e.stopPropagation()}>
                                {isReplying ? (
                                  <div>
                                    <textarea
                                      autoFocus
                                      value={replyInput}
                                      onChange={(e) => setReplyInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(comment.id); }
                                        if (e.key === 'Escape') { setReplyingToId(null); setReplyInput(''); }
                                      }}
                                      placeholder="Write a reply…"
                                      rows={2}
                                      style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', color: '#F8FFFA', fontFamily: '"Saans", sans-serif', fontSize: 11, padding: '5px 7px', resize: 'none', outline: 'none', caretColor: '#00ff64', boxSizing: 'border-box' }}
                                    />
                                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', marginTop: 5 }}>
                                      <button onClick={() => { setReplyingToId(null); setReplyInput(''); }} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.3)', fontFamily: '"Saans", sans-serif', fontSize: 10, cursor: 'pointer', padding: '2px 8px' }}>Cancel</button>
                                      <button onClick={() => submitReply(comment.id)} disabled={!replyInput.trim()} style={{ background: replyInput.trim() ? '#008c44' : '#1a1a1a', border: '1px solid #2a2a2a', color: replyInput.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontFamily: '"Saans", sans-serif', fontSize: 10, cursor: replyInput.trim() ? 'pointer' : 'default', padding: '2px 8px' }}>Reply</button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => { setReplyingToId(comment.id); setReplyInput(''); }}
                                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', fontFamily: '"Saans", sans-serif', fontSize: 11, cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: 4 }}
                                  >
                                    ↳ Reply
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Show/hide resolved toggle */}
                      {resolvedCount > 0 && (
                        <button
                          onClick={() => setShowResolved((v) => !v)}
                          style={{ background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.3)', fontFamily: '"Saans", sans-serif', fontSize: 11, cursor: 'pointer', padding: '5px 12px', width: '100%', textAlign: 'center' }}
                        >
                          {showResolved ? `Hide resolved (${resolvedCount})` : `Show resolved (${resolvedCount})`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Footer hint */}
              <div style={{ padding: '10px 14px', borderTop: '1px solid #2a2a2a', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: '"Saans", sans-serif', textAlign: 'center' }}>
                  Click slide to pin · Share link to share comments
                </div>
              </div>
            </div>
          ) : (
            activeSlide && (
              <EditPanel
                slide={activeSlide}
                onChange={(updated) => updateActiveSlide(updated as Partial<SlideData>)}
                colorMode={colorMode}
                onColorModeChange={setColorMode}
                slideColorMode={slideColorOverrides[activeSlide.id]}
                onSlideColorModeChange={(mode) => {
                  setSlideColorOverrides((prev) => {
                    const next = { ...prev };
                    if (mode === undefined) delete next[activeSlide.id];
                    else next[activeSlide.id] = mode;
                    return next;
                  });
                }}
              />
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            gridArea: 'bottombar', background: '#111111', borderTop: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 48, gap: 16, flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13,
              cursor: activeIndex === 0 ? 'default' : 'pointer', padding: '5px 14px',
            }}
            onMouseEnter={(e) => { if (activeIndex > 0) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#F8FFFA'; }}
          >
            ← Prev
          </button>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  all: 'unset', width: i === activeIndex ? 16 : 6, height: 6,
                  background: i === activeIndex ? '#00ff64' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', transition: 'width 0.2s, background 0.2s',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={activeIndex === slides.length - 1}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a',
              color: activeIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : '#F8FFFA',
              fontFamily: '"Saans", sans-serif', fontSize: 13,
              cursor: activeIndex === slides.length - 1 ? 'default' : 'pointer', padding: '5px 14px',
            }}
            onMouseEnter={(e) => { if (activeIndex < slides.length - 1) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ff64'; (e.currentTarget as HTMLButtonElement).style.color = '#00ff64'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = activeIndex === slides.length - 1 ? 'rgba(255,255,255,0.2)' : '#F8FFFA'; }}
          >
            Next →
          </button>
        </div>
      </div>

      {showAddModal && <AddSlideModal onAdd={addSlide} onClose={() => setShowAddModal(false)} />}

      {showRecents && (
        <RecentDecksModal
          currentDeckId={deckIdRef.current}
          onLoad={(entry: DeckEntry) => {
            setSlides(entry.slides);
            setColorMode(entry.colorMode);
            setSlideColorOverrides(entry.slideColorOverrides ?? {});
            setActiveIndex(0);
            deckIdRef.current = entry.id;
            setCurrentDeckId(entry.id);
            setShowRecents(false);
          }}
          onClose={() => setShowRecents(false)}
        />
      )}

      {/* Viewer name prompt */}
      {showNamePrompt && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, fontFamily: '"Saans", sans-serif' }}
          onClick={() => { setShowNamePrompt(false); setPendingCommentPos(null); }}
        >
          <div
            style={{ background: '#111111', border: '1px solid #2a2a2a', padding: 32, width: 340, maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontFamily: '"Serrif VF", serif', fontSize: 22, color: '#ffffff', marginBottom: 6, fontWeight: 400 }}>
              Who&apos;s commenting?
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: 20 }}>
              Your name will appear on comments you leave.
            </div>
            <input
              autoFocus
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmName(); if (e.key === 'Escape') { setShowNamePrompt(false); setPendingCommentPos(null); } }}
              placeholder="Your name"
              style={{
                width: '100%',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#F8FFFA',
                fontFamily: '"Saans", sans-serif',
                fontSize: 14,
                padding: '10px 12px',
                outline: 'none',
                caretColor: '#00ff64',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                onClick={() => { setShowNamePrompt(false); setPendingCommentPos(null); setNameInputValue(''); }}
                style={{ background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.4)', fontFamily: '"Saans", sans-serif', fontSize: 13, cursor: 'pointer', padding: '7px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmName}
                disabled={!nameInputValue.trim()}
                style={{ background: nameInputValue.trim() ? '#008c44' : '#1a1a1a', border: '1px solid #2a2a2a', color: nameInputValue.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500, cursor: nameInputValue.trim() ? 'pointer' : 'default', padding: '7px 16px' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google setup modal */}
      {googleSetupNeeded && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, fontFamily: '"Saans", sans-serif' }} onClick={() => setGoogleSetupNeeded(false)}>
          <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: 40, width: 520, maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: '"Serrif VF", serif', fontSize: 24, color: '#ffffff', marginBottom: 8 }}>Connect Google Slides</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 24 }}>Add a Google OAuth Client ID to enable one-click export into Google Slides.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {[
                ['1', 'Go to', 'console.cloud.google.com/apis/credentials'],
                ['2', 'Click', '+ Create Credentials → OAuth client ID'],
                ['3', 'Type:', 'Web application'],
                ['4', 'Add authorized origin:', 'https://slide-gen-phi.vercel.app'],
                ['5', 'Run:', 'vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID'],
              ].map(([num, label, code]) => (
                <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: '"Saans Mono", monospace', fontSize: 11, color: '#008c44', minWidth: 18, paddingTop: 2 }}>{num}.</div>
                  <div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{label} </span>
                    <code style={{ fontFamily: '"Saans Mono", monospace', fontSize: 12, color: '#00ff64', background: 'rgba(0,255,100,0.06)', padding: '2px 6px' }}>{code}</code>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setGoogleSetupNeeded(false)} style={{ background: '#008c44', border: 'none', color: 'white', fontFamily: '"Saans", sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '8px 20px' }}>Got it</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-output { display: block !important; }
          .slide-for-print { page-break-after: always; display: block; }
          .slide-for-print:last-child { page-break-after: avoid; }
        }
      `}</style>
    </>
  );
}
