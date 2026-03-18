import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class presentation designer and storyteller. Your job is to create compelling slide decks with a strong narrative arc.

You are given scraped content from a webpage. Your job is to extract the most important ideas and turn them into a tight, compelling slide deck.

NARRATIVE ARC — follow this structure:
1. Cover slide — arresting headline that frames the story
2. Section slide — introduce the core problem or opportunity
3. Stats slide — data that makes the problem visceral and real
4. Diagram slide — show how the solution works (3 columns: before → how → after, or input → process → output)
5. Content slide — 2-column: key proof points or differentiators
6. Quote slide — a powerful customer or expert quote
7. Customer story slide — specific company result with metrics
8. Three-col slide — 3 pillars, features, or principles
9. Checklist or Feature-list slide — specific deliverables or capabilities
10. Back cover — strong CTA

You can adjust the number and order of slides (8–12 total) based on what serves the story best. Always end with a back-cover.

SLIDE TYPES — return valid JSON matching these interfaces exactly:

{ type: "cover", eyebrow: string, headline: string, subheadline?: string, imageUrl?: string }
{ type: "section", number: string, label: string, headline: string }
{ type: "stats", headline: string, thesis: string, metrics: [{ value: string, label: string, color: "olive"|"teal"|"magenta" }] }
  — always 3 metrics, each color used once
{ type: "diagram", headline: string, columns: [{ header: string, body: string, tag?: string }] }
  — 3 columns
{ type: "content", headline: string, columns: [{ heading: string, body: string }] }
  — 2 columns
{ type: "quote", quote: string, attribution: string, imageUrl?: string }
{ type: "customer-story", customerName: string, headline: string, body: string, attribution: string, metrics: [{ value: string, label: string }] }
  — 2–3 metrics
{ type: "three-col", headline: string, columns: [{ icon: string, header: string, body: string }] }
  — 3 columns, use typographic symbols for icons: ◆ ↗ ✦ ⊞ ⊡ → ⬡ ◉
{ type: "feature-list", headline: string, items: [{ icon: string, title: string, body: string }] }
  — 3–5 items
{ type: "checklist", headline: string, items: [{ title: string, body: string, checked: boolean }] }
  — 4–6 items, first 1–2 checked
{ type: "agenda", title: string, items: string[] }
  — 4–7 items
{ type: "back-cover", cta: string, url: string }
{ type: "big-quote", quote: string, attribution: string, role?: string, imageUrl?: string }
{ type: "two-col-media", eyebrow?: string, headline: string, body: string, imageUrl?: string }

RULES:
- Headlines: punchy, specific, present tense. Never generic ("Introduction", "Overview").
- Serrif VF renders at 44px — keep headlines under 60 characters.
- Stats: use real-feeling numbers from the page content where possible. If none exist, invent plausible ones.
- Quote: write it as a real person would say it — specific, first-person, outcome-focused.
- Customer story: use examples from the page content if available; otherwise use a plausible company.
- Back-cover CTA: action verb + outcome ("See how [company/product] can [benefit]")
- Return ONLY the JSON array. No explanation, no markdown fences, no other text.

IMAGE PLACEMENT (when images are provided):
- Images available from the source URL are listed. Use them where they are most relevant.
- Only use images on slide types that support imageUrl: cover, quote, big-quote, two-col-media, full-image.
- Each image should be used at most once.`;

const MAX_CONTENT_CHARS = 8000;

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
  return '';
}

function extractImages(html: string, baseUrl: string): string[] {
  const seen = new Set<string>();
  const results: string[] = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith('data:')) continue;
    if (src.includes('.svg')) continue;
    if (/1x1|pixel|track|spacer|blank/i.test(src)) continue;
    try { src = new URL(src, baseUrl).href; } catch { continue; }
    if (!seen.has(src)) { seen.add(src); results.push(src); }
    if (results.length >= 6) break;
  }
  return results;
}

export async function POST(request: Request) {
  try {
    const { url, audience, tone } = await request.json() as {
      url: string;
      audience?: string;
      tone?: string;
    };

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the URL
    let pageText = '';
    let pageTitle = '';
    let pageImages: string[] = [];

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000),
      });
      const html = await res.text();
      pageTitle = extractTitle(html);
      pageImages = extractImages(html, url);
      pageText = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, MAX_CONTENT_CHARS);
    } catch {
      return NextResponse.json({ error: 'Could not fetch that URL. Make sure it\'s publicly accessible.' }, { status: 422 });
    }

    if (!pageText || pageText.length < 100) {
      return NextResponse.json({ error: 'Not enough content found at that URL to build a deck.' }, { status: 422 });
    }

    const imageHint = pageImages.length > 0
      ? `\n\nImages found on the page — you MAY use these as imageUrl values on slides where they fit:\n${pageImages.map((u, i) => `${i + 1}. ${u}`).join('\n')}`
      : '';

    const userMessage = `Create a presentation deck based on the content from this webpage: ${url}
${pageTitle ? `Page title: "${pageTitle}"` : ''}
Audience: ${audience || 'business professionals'}
Tone: ${tone || 'persuasive and clear'}

Here is the page content to transform into a deck:
${pageText}${imageHint}

Return a JSON array of 9–11 slides following the narrative arc in your instructions. Extract the key ideas, data points, and messages from the content above.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const rawSlides = JSON.parse(clean);

    const slides = rawSlides.map((s: Record<string, unknown>, i: number) => ({
      ...s,
      id: `gen-${Date.now()}-${i}`,
    }));

    return NextResponse.json({ slides });
  } catch (err) {
    console.error('From-URL generate error:', err);
    return NextResponse.json({ error: 'Failed to generate slides from URL' }, { status: 500 });
  }
}
