import type { SlideData, ThreeColItem, FeatureListItem, ContentColumn, DiagramColumn, ChecklistItem, LogoOverlay } from './slides';

// Canonical content extracted from any slide
interface CanonicalContent {
  headline: string;
  body: string;
  eyebrow: string;
  quote: string;
  attribution: string;
  imageUrl?: string;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  items: unknown[];
  columns: unknown[];
  members: unknown[];
  metrics: unknown[];
}

function extract(slide: SlideData): CanonicalContent {
  const s = slide as unknown as Record<string, unknown>;
  return {
    headline: (s.headline ?? s.title ?? s.quote ?? s.cta ?? '') as string,
    body: (s.body ?? s.subheadline ?? s.thesis ?? '') as string,
    eyebrow: (s.eyebrow ?? s.label ?? s.number ?? '') as string,
    quote: (s.quote ?? s.headline ?? '') as string,
    attribution: (s.attribution ?? '') as string,
    imageUrl: s.imageUrl as string | undefined,
    imageX: s.imageX as number | undefined,
    imageY: s.imageY as number | undefined,
    imageZoom: s.imageZoom as number | undefined,
    items: Array.isArray(s.items) ? s.items : [],
    columns: Array.isArray(s.columns) ? s.columns : [],
    members: Array.isArray(s.members) ? s.members : [],
    metrics: Array.isArray(s.metrics) ? s.metrics : [],
  };
}

const ICONS = ['◆', '↗', '✦', '⊞', '⊡'];

function toThreeColItems(items: unknown[], columns: unknown[]): ThreeColItem[] {
  const src = (columns.length >= 2 ? columns : items).slice(0, 3);
  const result: ThreeColItem[] = src.map((c: unknown, i: number) => {
    const col = c as Record<string, unknown>;
    return {
      icon: (col.icon as string) ?? ICONS[i] ?? '◆',
      header: (col.header ?? col.heading ?? col.title ?? col.name ?? `Point ${i + 1}`) as string,
      body: (col.body ?? '') as string,
    };
  });
  while (result.length < 3) result.push({ icon: ICONS[result.length] ?? '◆', header: `Point ${result.length + 1}`, body: '' });
  return result;
}

function toFeatureItems(items: unknown[], columns: unknown[]): FeatureListItem[] {
  const src = (items.length > 0 ? items : columns).slice(0, 5);
  const result: FeatureListItem[] = src.map((c: unknown, i: number) => {
    const col = c as Record<string, unknown>;
    if (typeof col === 'string') return { icon: ICONS[i] ?? '◆', title: col, body: '' };
    return {
      icon: (col.icon as string) ?? ICONS[i] ?? '◆',
      title: (col.title ?? col.header ?? col.heading ?? `Feature ${i + 1}`) as string,
      body: (col.body ?? '') as string,
    };
  });
  if (result.length === 0) result.push({ icon: '◆', title: 'Feature', body: '' });
  return result;
}

function toContentColumns(columns: unknown[], headline: string, body: string): ContentColumn[] {
  const src = columns.slice(0, 2);
  const result: ContentColumn[] = src.map((c: unknown) => {
    const col = c as Record<string, unknown>;
    return {
      heading: (col.heading ?? col.header ?? col.title ?? 'Column') as string,
      body: (col.body ?? '') as string,
    };
  });
  if (result.length === 0 && body) result.push({ heading: headline, body });
  while (result.length < 2) result.push({ heading: 'Column', body: '' });
  return result.slice(0, 2);
}

function toDiagramColumns(columns: unknown[]): DiagramColumn[] {
  const src = columns.slice(0, 3);
  const result: DiagramColumn[] = src.map((c: unknown, i: number) => {
    const col = c as Record<string, unknown>;
    return {
      header: (col.header ?? col.heading ?? `Step ${i + 1}`) as string,
      body: (col.body ?? '') as string,
      tag: col.tag as string | undefined,
    };
  });
  while (result.length < 3) result.push({ header: `Step ${result.length + 1}`, body: '' });
  return result;
}

function toChecklistItems(items: unknown[], columns: unknown[]): ChecklistItem[] {
  const src = (items.length > 0 ? items : columns).slice(0, 5);
  const result: ChecklistItem[] = src.map((c: unknown) => {
    if (typeof c === 'string') return { title: c, body: '', checked: false };
    const col = c as Record<string, unknown>;
    return {
      title: (col.title ?? col.header ?? col.heading ?? 'Item') as string,
      body: (col.body ?? '') as string,
      checked: (col.checked ?? false) as boolean,
    };
  });
  if (result.length === 0) result.push({ title: 'Item', body: '', checked: false });
  return result;
}

function toAgendaItems(items: unknown[], columns: unknown[]): string[] {
  const src = items.length > 0 ? items : columns;
  const result = src.slice(0, 8).map((c: unknown) => {
    if (typeof c === 'string') return c;
    const col = c as Record<string, unknown>;
    return (col.title ?? col.header ?? col.heading ?? 'Topic') as string;
  });
  if (result.length === 0) result.push('Topic');
  return result;
}

export function remixToType(current: SlideData, targetType: string): SlideData {
  const c = extract(current);
  const s = current as unknown as Record<string, unknown>;
  const base = {
    id: current.id,
    hideLogo: s.hideLogo as boolean | undefined,
    logos: s.logos as LogoOverlay[] | undefined,
  };

  switch (targetType) {
    case 'cover':
      return { ...base, type: 'cover', eyebrow: c.eyebrow, headline: c.headline, subheadline: c.body, imageUrl: c.imageUrl, imageX: c.imageX, imageY: c.imageY, imageZoom: c.imageZoom };

    case 'section':
      return { ...base, type: 'section', number: c.eyebrow || '01', label: '', headline: c.headline };

    case 'two-col-media':
      return { ...base, type: 'two-col-media', eyebrow: c.eyebrow, headline: c.headline, body: c.body, imageUrl: c.imageUrl, imageX: c.imageX, imageY: c.imageY, imageZoom: c.imageZoom };

    case 'quote':
      return { ...base, type: 'quote', quote: c.quote || c.headline, attribution: c.attribution, imageUrl: c.imageUrl, imageX: c.imageX, imageY: c.imageY, imageZoom: c.imageZoom };

    case 'big-quote':
      return { ...base, type: 'big-quote', quote: c.quote || c.headline, attribution: c.attribution, imageUrl: c.imageUrl, imageX: c.imageX, imageY: c.imageY, imageZoom: c.imageZoom };

    case 'three-col':
      return { ...base, type: 'three-col', headline: c.headline, columns: toThreeColItems(c.items, c.columns) };

    case 'feature-list':
      return { ...base, type: 'feature-list', headline: c.headline, items: toFeatureItems(c.items, c.columns) };

    case 'content':
      return { ...base, type: 'content', headline: c.headline, columns: toContentColumns(c.columns, c.headline, c.body) };

    case 'diagram':
      return { ...base, type: 'diagram', headline: c.headline, columns: toDiagramColumns(c.columns) };

    case 'stats': {
      const metrics = (c.metrics as Record<string, unknown>[]).length > 0
        ? c.metrics as { value: string; label: string; color: 'olive' | 'teal' | 'magenta' }[]
        : [{ value: '0%', label: 'Key metric', color: 'olive' as const }];
      return { ...base, type: 'stats', headline: c.headline, thesis: c.body, metrics };
    }

    case 'customer-story':
      return { ...base, type: 'customer-story', customerName: 'Customer', headline: c.headline, body: c.body || c.quote, attribution: c.attribution, metrics: [] };

    case 'agenda':
      return { ...base, type: 'agenda', title: c.headline || 'Agenda', items: toAgendaItems(c.items, c.columns) };

    case 'checklist':
      return { ...base, type: 'checklist', headline: c.headline, items: toChecklistItems(c.items, c.columns) };

    case 'hero':
      return { ...base, type: 'hero', headline: c.headline, customerLogos: [] };

    case 'back-cover':
      return { ...base, type: 'back-cover', cta: c.headline, url: 'airops.com' };

    case 'team':
      return { ...base, type: 'team', headline: c.headline, members: (c.members as { name: string; role: string }[]).length > 0 ? c.members as { name: string; role: string }[] : [{ name: 'Team Member', role: 'Role' }] };

    case 'contact':
      return { ...base, type: 'contact', headline: c.headline, cards: [{ name: 'Your Name', role: 'Title, AirOps', email: 'name@airops.com', linkedin: '' }] };

    default:
      return current;
  }
}

export const REMIX_OPTIONS: Record<string, { type: string; label: string }[]> = {
  cover:           [{ type: 'section', label: 'Section' }, { type: 'two-col-media', label: 'Two-col' }, { type: 'big-quote', label: 'Big quote' }, { type: 'hero', label: 'Hero' }],
  section:         [{ type: 'cover', label: 'Cover' }, { type: 'two-col-media', label: 'Two-col' }, { type: 'big-quote', label: 'Big quote' }],
  'two-col-media': [{ type: 'cover', label: 'Cover' }, { type: 'section', label: 'Section' }, { type: 'quote', label: 'Quote' }, { type: 'big-quote', label: 'Big quote' }, { type: 'content', label: 'Content' }],
  quote:           [{ type: 'big-quote', label: 'Big quote' }, { type: 'customer-story', label: 'Story' }, { type: 'two-col-media', label: 'Two-col' }],
  'big-quote':     [{ type: 'quote', label: 'Quote' }, { type: 'customer-story', label: 'Story' }, { type: 'two-col-media', label: 'Two-col' }],
  'three-col':     [{ type: 'feature-list', label: 'Feature list' }, { type: 'content', label: 'Content' }, { type: 'diagram', label: 'Diagram' }, { type: 'checklist', label: 'Checklist' }],
  'feature-list':  [{ type: 'three-col', label: 'Three-col' }, { type: 'content', label: 'Content' }, { type: 'checklist', label: 'Checklist' }, { type: 'agenda', label: 'Agenda' }],
  content:         [{ type: 'three-col', label: 'Three-col' }, { type: 'feature-list', label: 'Feature list' }, { type: 'diagram', label: 'Diagram' }, { type: 'checklist', label: 'Checklist' }],
  diagram:         [{ type: 'three-col', label: 'Three-col' }, { type: 'content', label: 'Content' }, { type: 'feature-list', label: 'Feature list' }],
  stats:           [{ type: 'checklist', label: 'Checklist' }, { type: 'three-col', label: 'Three-col' }, { type: 'feature-list', label: 'Feature list' }],
  'customer-story':[{ type: 'quote', label: 'Quote' }, { type: 'big-quote', label: 'Big quote' }, { type: 'stats', label: 'Stats' }],
  agenda:          [{ type: 'checklist', label: 'Checklist' }, { type: 'feature-list', label: 'Feature list' }, { type: 'three-col', label: 'Three-col' }],
  checklist:       [{ type: 'agenda', label: 'Agenda' }, { type: 'feature-list', label: 'Feature list' }, { type: 'content', label: 'Content' }, { type: 'three-col', label: 'Three-col' }],
  team:            [{ type: 'contact', label: 'Contact' }],
  contact:         [{ type: 'team', label: 'Team' }],
  hero:            [{ type: 'cover', label: 'Cover' }, { type: 'section', label: 'Section' }],
  'back-cover':    [{ type: 'cover', label: 'Cover' }, { type: 'hero', label: 'Hero' }],
};
