import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic();

const SLIDE_SCHEMAS = `
{ type: "cover", eyebrow: string, headline: string, subheadline?: string, imageUrl?: string }
{ type: "section", number: string, label: string, headline: string }
{ type: "stats", headline: string, thesis: string, metrics: [{ value: string, label: string, color: "olive"|"teal"|"magenta" }] }
  — always 3 metrics, each color used once (olive, teal, magenta)
{ type: "diagram", headline: string, columns: [{ header: string, body: string, tag?: string }] }
  — exactly 3 columns
{ type: "content", headline: string, columns: [{ heading: string, body: string }] }
  — exactly 2 columns
{ type: "quote", quote: string, attribution: string, imageUrl?: string }
{ type: "big-quote", quote: string, attribution: string, imageUrl?: string }
{ type: "customer-story", customerName: string, headline: string, body: string, attribution: string, metrics: [{ value: string, label: string }] }
  — 2–3 metrics
{ type: "three-col", headline: string, columns: [{ icon: string, header: string, body: string }] }
  — exactly 3 columns; icons: ◆ ↗ ✦ ⊞ ⊡ → ⬡ ◉
{ type: "feature-list", headline: string, items: [{ icon: string, title: string, body: string }] }
  — 3–5 items; icons: ◆ ↗ ✦ ⊞ ⊡
{ type: "checklist", headline: string, items: [{ title: string, body: string, checked: boolean }] }
  — 4–6 items
{ type: "agenda", title: string, items: string[] }
  — 4–7 items (strings only)
{ type: "back-cover", cta: string, url: string }
{ type: "hero", headline: string, customerLogos: [] }
{ type: "team", headline: string, members: [{ name: string, role: string }] }
{ type: "contact", headline: string, cards: [{ name: string, role: string, email: string, linkedin: string }] }
{ type: "two-col-media", eyebrow?: string, headline: string, body: string, imageUrl?: string }
`.trim();

const SYSTEM_PROMPT = `You are a presentation layout specialist. Your job is to take an existing slide's content and reformat it to fit a different layout type — keeping ALL the same information, just restructuring it to match the new layout.

Rules:
- Preserve EVERY piece of content from the source slide: headlines, body text, bullet points, metrics, quotes, attributions, image URLs, etc.
- Adapt the structure to fit the target layout. If the target has 3 columns but the source only has 2 items, split the content intelligently or infer a third point from context.
- If the target layout needs content that isn't present (e.g. converting a simple cover to a stats slide), synthesize plausible placeholder content based on the headline/topic — but prefer to extract from existing content first.
- Preserve the "id" field exactly.
- Set the "type" field to the target type exactly.
- Preserve "hideLogo" and "logos" fields if present.
- For image slides (cover, quote, big-quote, two-col-media): preserve the imageUrl, imageX, imageY, imageZoom fields.
- Headlines must be under 60 characters.
- Return ONLY the JSON object — no explanation, no markdown fences, nothing else.

Slide type schemas:
${SLIDE_SCHEMAS}`;

export async function POST(request: Request) {
  try {
    const { slide, targetType } = await request.json();

    const userMessage = `Reformat this slide to the "${targetType}" layout. Keep all the same content.

Source slide:
${JSON.stringify(slide, null, 2)}`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const remixed = JSON.parse(clean);

    return NextResponse.json({ slide: remixed });
  } catch (err) {
    console.error('AI remix error:', err);
    return NextResponse.json({ error: 'Failed to remix slide' }, { status: 500 });
  }
}
