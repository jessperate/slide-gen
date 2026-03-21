import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

const TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();
    if (!data || typeof data !== 'string') {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    const key = shortId();
    await kv.set(`share:${key}`, data, { ex: TTL_SECONDS });
    return NextResponse.json({ key });
  } catch (e) {
    console.error('share POST error', e);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  try {
    const data = await kv.get<string>(`share:${key}`);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data });
  } catch (e) {
    console.error('share GET error', e);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}
