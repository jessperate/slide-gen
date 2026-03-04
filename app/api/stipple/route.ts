import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const STIPPLE_PROMPT =
  'Transform this portrait photo into a fine stipple illustration using only tiny dots. ' +
  'Use a single dark forest-green ink color (#1a3a2a) on a pure white background. ' +
  'The dots should be very small and densely packed — pack them tightly in shadow areas, sparse in highlights, with no dots at all in the brightest highlights. ' +
  'Do not use lines, hatching, or crosshatching — only stipple dots. ' +
  'Preserve the likeness and facial features accurately. The result should look like a high-quality editorial stipple portrait engraving. ' +
  'Output only the stipple illustration — no text, no borders, no circular crop, no extra elements.';

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const model = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-2.0-flash-exp-image-generation';

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: STIPPLE_PROMPT },
            { inlineData: { mimeType: mimeType ?? 'image/jpeg', data: imageBase64 } },
          ],
        },
      ],
      config: { responseModalities: ['TEXT', 'IMAGE'] },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { data?: string } }) => p.inlineData?.data
    );

    if (!imagePart?.inlineData?.data) {
      return NextResponse.json({ error: 'No image returned from Gemini' }, { status: 500 });
    }

    return NextResponse.json({
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType ?? 'image/png',
    });
  } catch (err) {
    console.error('Stipple error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Failed to apply stipple effect' }, { status: 500 });
  }
}
