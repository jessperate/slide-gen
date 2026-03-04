import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const STIPPLE_PROMPT =
  'Transform this portrait photo into a black-and-white stipple illustration. ' +
  'Use varying dot sizes and densities to create depth, shading, and texture in the style of editorial engraving. ' +
  'The background should be clean white. Keep the person clearly recognizable. ' +
  'Output only the stipple illustration — no text, no borders, no extra elements.';

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
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
    return NextResponse.json({ error: 'Failed to apply stipple effect' }, { status: 500 });
  }
}
