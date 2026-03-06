import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class presentation designer. The user has uploaded an existing PDF presentation that they want reformatted into the AirOps brand style.

Your job is to:
1. Extract all the content, key messages, data points, and narrative from the PDF
2. Preserve the core information faithfully — do not invent data or change metrics
3. Reformat everything into polished, on-brand slides using the slide types below

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
{ type: "big-quote", quote: string, attribution: string, role?: string }
{ type: "two-col-media", eyebrow?: string, headline: string, body: string }

RULES:
- PRESERVE all key data points, metrics, quotes, and factual content from the original — never invent numbers
- MAINTAIN the logical flow and narrative structure of the original deck
- IMPROVE headlines: punchy, specific, present tense, under 60 characters. Never generic ("Introduction", "Overview")
- Serrif VF renders at 44px — keep headlines under 60 characters
- Choose the most appropriate slide type for each section of content:
  - Intro/agenda → agenda slide
  - Customer quotes/testimonials → quote or big-quote slides
  - Data/metrics/results → stats slide
  - How something works/process steps → diagram slide
  - Lists of features or benefits → feature-list or three-col slide
  - Two key points or comparisons → content slide
  - Company/customer case study → customer-story slide
- Aim for 8–12 slides total, always ending with a back-cover
- If there is no clear CTA or URL in the original, use a sensible placeholder
- Return ONLY the JSON array. No explanation, no markdown fences, no other text.`;

export async function POST(request: Request) {
  try {
    const { pdfData, audience, tone } = await request.json() as {
      pdfData: string;
      audience?: string;
      tone?: string;
    };

    if (!pdfData) {
      return NextResponse.json({ error: 'No PDF data provided' }, { status: 400 });
    }

    // Strip data URI prefix if present
    const base64 = pdfData.replace(/^data:application\/pdf;base64,/, '');

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            } as Anthropic.DocumentBlockParam,
            {
              type: 'text',
              text: `Reformat this presentation into AirOps brand slide format.
Audience: ${audience || 'business professionals'}
Tone: ${tone || 'persuasive and clear'}

Extract all content from the PDF and map it to the most appropriate slide types. Return a JSON array of 8–12 slides.`,
            },
          ],
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const rawSlides = JSON.parse(clean);

    const slides = rawSlides.map((s: Record<string, unknown>, i: number) => ({
      ...s,
      id: `reformat-${Date.now()}-${i}`,
    }));

    return NextResponse.json({ slides });
  } catch (err) {
    console.error('Reformat PDF error:', err);
    return NextResponse.json({ error: 'Failed to reformat PDF' }, { status: 500 });
  }
}
