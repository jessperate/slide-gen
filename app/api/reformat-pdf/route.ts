import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class presentation designer. The user has uploaded an existing PDF presentation that they want reformatted into the AirOps brand style.

Your job is to:
1. Count the exact number of slides in the PDF
2. Produce exactly that same number of output slides — one output slide per input slide
3. Preserve all content, data, and narrative faithfully — never invent or change numbers
4. Reformat each slide into the most appropriate on-brand slide type

CONTENT TYPE MAPPING — for each input slide, choose the output type that best matches:

| Original slide contains | Use this type |
|---|---|
| Title / opening / deck name | cover |
| Table of contents / agenda list | agenda |
| Section divider / chapter title | section |
| Chart, graph, data visualization, KPIs, metrics, percentages | stats |
| Process flow, how-it-works, before/after, steps | diagram |
| Two-column text, two key points, comparison | content |
| Three pillars, three features, three benefits | three-col |
| Bulleted feature list, capability list (4–5 items) | feature-list |
| Checklist, deliverables, what's included | checklist |
| Customer testimonial / pull quote (short) | quote |
| Large impactful quote with attribution | big-quote |
| Customer case study with metrics | customer-story |
| Text + image or screenshot side by side | two-col-media |
| Data table, comparison matrix, feature grid, spec sheet | table |
| Chart, graph, bar chart, line graph, pie chart, data visualization | chart |
| Closing / thank you / contact / next steps | back-cover |

CHARTS AND DATA VISUALIZATIONS:
When a slide has a chart, graph, or data visualization, translate it to a stats slide:
- Extract the 2–3 most important data points as metrics
- Use the chart title or takeaway as the headline
- Write a thesis that captures the insight the chart is showing
- Preserve all exact values (percentages, dollar amounts, multipliers, counts)
- Assign colors: olive, teal, magenta — one each

SLIDE TYPES — return valid JSON matching these interfaces exactly:

{ type: "cover", eyebrow: string, headline: string, subheadline?: string }
{ type: "section", number: string, label: string, headline: string }
{ type: "stats", headline: string, thesis: string, metrics: [{ value: string, label: string, color: "olive"|"teal"|"magenta" }] }
  — always exactly 3 metrics, each color used once
{ type: "diagram", headline: string, columns: [{ header: string, body: string, tag?: string }] }
  — exactly 3 columns
{ type: "content", headline: string, columns: [{ heading: string, body: string }] }
  — exactly 2 columns
{ type: "quote", quote: string, attribution: string }
{ type: "big-quote", quote: string, attribution: string, role?: string }
{ type: "customer-story", customerName: string, headline: string, body: string, attribution: string, metrics: [{ value: string, label: string }] }
  — 2–3 metrics
{ type: "three-col", headline: string, columns: [{ icon: string, header: string, body: string }] }
  — exactly 3 columns, use typographic symbols for icons: ◆ ↗ ✦ ⊞ ⊡ → ⬡ ◉
{ type: "feature-list", headline: string, items: [{ icon: string, title: string, body: string }] }
  — 3–5 items, use typographic symbols for icons
{ type: "checklist", headline: string, items: [{ title: string, body: string, checked: boolean }] }
  — 4–6 items, first 1–2 checked
{ type: "agenda", title: string, items: string[] }
  — 4–7 items
{ type: "two-col-media", eyebrow?: string, headline: string, body: string }
{ type: "table", headline: string, headers: string[], rows: string[][] }
  — 2–6 columns, up to 8 rows; use for any data table, comparison grid, or spec sheet
{ type: "chart", headline: string, description?: string, chartwizState: { chartType: "vertical"|"horizontal"|"line"|"pie"|"stacked"|"slope", headline: string, description?: string, yAxisLabel?: string, xAxisLabel?: string, vertRows?: [{label:string,value:number}], compRows?: [{label:string,value:number}], pieRows?: [{label:string,value:number}], lineSeries?: [{name:string,pts:[{x:string,y:number}]}], stkCols?: string[], stkSegs?: [{label:string,values:number[]}], slopeRows?: [{name:string,left:number,right:number}], slopeLeftLabel?: string, slopeRightLabel?: string } }
  — use for any chart or data visualization; pick the chartType that best matches the original chart; populate only the data array for that chartType with the exact values from the source
{ type: "back-cover", cta: string, url: string }

RULES:
- OUTPUT EXACTLY THE SAME NUMBER OF SLIDES AS THE INPUT — count input slides first, then produce that many
- PRESERVE all exact numbers, percentages, metrics, quotes, and named entities from the original
- IMPROVE headlines: punchy, specific, present tense, max 60 characters. Never generic ("Introduction", "Overview", "Agenda")
- Serrif VF renders at 44px — keep headlines under 60 characters
- If the last slide is not a back-cover or closing slide, still map it to back-cover
- If there is no clear URL in the original, use a sensible placeholder
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

First, count the total number of slides in this PDF. Then produce exactly that many output slides — one for each input slide. Map each slide to the most appropriate brand slide type. Charts and data visualizations should become stats slides with the key metrics extracted. Return a JSON array.`,
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
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Reformat PDF error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
