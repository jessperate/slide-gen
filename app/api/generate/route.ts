import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class presentation designer and storyteller. Your job is to create compelling slide decks with a strong narrative arc.

Given a presentation topic, audience, and tone, you return a JSON array of slide objects. Each slide must match one of these types exactly.

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

{ type: "cover", eyebrow: string, headline: string, subheadline?: string }
{ type: "section", number: string, label: string, headline: string }
{ type: "stats", headline: string, thesis: string, metrics: [{ value: string, label: string, color: "olive"|"teal"|"magenta" }] }
  — always 3 metrics, each color used once
{ type: "diagram", headline: string, columns: [{ header: string, body: string, tag?: string }] }
  — 3 columns
{ type: "content", headline: string, columns: [{ heading: string, body: string }] }
  — 2 columns
{ type: "quote", quote: string, attribution: string }
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

RULES:
- Headlines: punchy, specific, present tense. Never generic ("Introduction", "Overview").
- Serrif VF renders at 44px — keep headlines under 60 characters.
- Stats: use real-feeling numbers (percentages, multipliers, dollar amounts). Make them feel earned.
- Quote: write it as a real person would say it — specific, first-person, outcome-focused.
- Customer story: pick a plausible real company or a clearly fictional one; name them specifically.
- Back-cover CTA: action verb + outcome ("See how [company/product] can [benefit]")
- Return ONLY the JSON array. No explanation, no markdown fences, no other text.`;

const MAX_CONTEXT_CHARS = 6000;

async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  // Strip HTML tags and collapse whitespace
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, MAX_CONTEXT_CHARS);
}

export async function POST(request: Request) {
  try {
    const { topic, audience, tone, context, contextUrl } = await request.json();

    let additionalContext = '';
    if (contextUrl) {
      try {
        additionalContext = await fetchUrlText(contextUrl);
      } catch {
        // If fetch fails, ignore and proceed without context
      }
    } else if (context) {
      additionalContext = (context as string).slice(0, MAX_CONTEXT_CHARS);
    }

    const userMessage = `Create a presentation deck about: "${topic}"
Audience: ${audience || 'business professionals'}
Tone: ${tone || 'persuasive and clear'}${additionalContext ? `\n\nAdditional context for the deck:\n${additionalContext}` : ''}

Return a JSON array of 9–11 slides following the narrative arc in your instructions.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip any accidental markdown fences
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const rawSlides = JSON.parse(clean);

    // Inject stable IDs
    const slides = rawSlides.map((s: Record<string, unknown>, i: number) => ({
      ...s,
      id: `gen-${Date.now()}-${i}`,
    }));

    return NextResponse.json({ slides });
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Failed to generate slides' }, { status: 500 });
  }
}
