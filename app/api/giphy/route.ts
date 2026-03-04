import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GIPHY_API_KEY not configured' }, { status: 500 });
  }

  const res = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=12&rating=g`
  );
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data?.meta?.msg || 'Giphy API error' }, { status: res.status });
  }

  return NextResponse.json(data);
}
