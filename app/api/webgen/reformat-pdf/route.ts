import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const maxDuration = 120;

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert web designer. The user has uploaded an existing PDF presentation that they want redesigned as a modern HTML presentation using the AirOps web design system.

Your job is to:
1. Analyze every slide in the PDF
2. Extract all content, data, quotes, and metrics faithfully
3. Map each slide (or group of related slides) to the most appropriate web section type
4. Return a JSON array of section objects

SECTION TYPES — map PDF content to these:

1. HERO — for title/opening slides
{ type: "hero", eyebrow?: string, headlineSerif: string, headlineSans: string, body: string, ctaLabel: string }

2. STATS — for slides with data, charts, KPIs, metrics
{ type: "stats", eyebrow?: string, headlineSerif: string, headlineSans: string, body?: string, cards: [{ heading: string, stat: string, direction: "up"|"down", description: string }] }
- 3-5 cards. Extract exact numbers from the PDF

3. TESTIMONIAL — for customer quotes, pull quotes
{ type: "testimonial", quote: string, personName: string, title: string, companyLogo?: string, stat?: { value: string, label: string } }
- companyLogo: use the company's domain if identifiable

4. FEATURES — for feature lists, capabilities, product sections
{ type: "features", eyebrow?: string, headlineSerif: string, headlineSans: string, body?: string, cards: [{ title: string, description: string, color: "pink"|"red"|"yellow"|"indigo" }] }
- 3-4 cards, each a different color

5. MANIFESTO — for big vision/mission statements, key takeaways
{ type: "manifesto", headline: string, body: string, highlightPhrase?: string }

6. FAQ — for Q&A slides, objection handling
{ type: "faq", headline: string, items: [{ question: string, answer: string }] }

7. CTA — for closing slides, next steps, contact
{ type: "cta", eyebrow?: string, headline: string, body?: string, ctaLabel: string, variant: "dark"|"indigo" }

8. SOCIAL PROOF — for logo walls, multiple quotes, client lists
{ type: "social-proof", headlineSerif?: string, headlineSans?: string, quotes: [{ quote: string, attribution: string, company?: string, color: "yellow"|"pink"|"green"|"blue"|"purple"|"teal" }] }

MAPPING GUIDANCE:
| PDF slide type | Best web section |
|---|---|
| Title / cover | hero |
| Data, charts, KPIs, metrics | stats |
| Customer quote | testimonial |
| Feature list, capabilities | features |
| Vision, mission, big idea | manifesto |
| Q&A, FAQ | faq |
| Closing, CTA, next steps | cta |
| Logo wall, multiple quotes | social-proof |
| Process/how-it-works | features (as steps) |
| Agenda/TOC | skip or merge into hero body |
| Section dividers | skip (fold into next section) |

RULES:
- Produce 6-10 sections total. Merge thin slides, skip pure section dividers
- PRESERVE all exact numbers, percentages, quotes, and company names
- Headlines: split into headlineSerif (line 1) and headlineSans (line 2), each 3-5 words
- No em dashes
- Always start with hero, always end with cta
- Return ONLY the JSON array. No explanation, no markdown fences.`;

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

    const base64 = pdfData.replace(/^data:application\/pdf;base64,/, '');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
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
              text: `Redesign this presentation as a modern HTML deck using the AirOps web design system.
Audience: ${audience || 'business professionals'}
Tone: ${tone || 'persuasive and clear'}

Extract all content faithfully. Map slides to the appropriate section types. Merge thin slides, skip dividers. Return a JSON array of 6-10 sections.`,
            },
          ],
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const rawSections = JSON.parse(clean);

    const sections = rawSections.map((s: Record<string, unknown>, i: number) => ({
      ...s,
      id: `wg-pdf-${Date.now()}-${i}`,
    }));

    return NextResponse.json({ sections });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Webgen reformat-pdf error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
