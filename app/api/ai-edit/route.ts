import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an AI slide designer embedded in a presentation builder. The user gives you a slide's JSON data and a natural-language request to modify it.

Your job: apply the requested changes and return the updated slide as valid JSON.

Rules:
- Preserve the "id" field exactly as-is.
- Preserve the "type" field UNLESS the user explicitly asks to change the layout (e.g. "make this a section slide").
- Make only the changes the user requests. Leave everything else the same.
- Return ONLY the JSON object — no explanation, no markdown fences, no other text.
- All string values must be properly escaped JSON strings.
- When asked to make content more compelling, punchy, or specific, apply real editorial judgment.
- Headlines should be under 60 characters. Body copy can be longer.`;

export async function POST(request: Request) {
  try {
    const { slide, message, history = [] } = await request.json();

    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...history,
      {
        role: 'user',
        content: `Current slide JSON:\n${JSON.stringify(slide, null, 2)}\n\nRequest: ${message}`,
      },
    ];

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const updatedSlide = JSON.parse(clean);

    return NextResponse.json({ slide: updatedSlide });
  } catch (err) {
    console.error('AI edit error:', err);
    return NextResponse.json({ error: 'Failed to edit slide' }, { status: 500 });
  }
}
