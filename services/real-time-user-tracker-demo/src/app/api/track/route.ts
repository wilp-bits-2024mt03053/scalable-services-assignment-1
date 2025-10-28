import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received track request:', JSON.stringify(body, null, 2));

    const targetUrl = process.env.NEXT_PUBLIC_API_TRACK_URL || 'http://localhost:8000/track';

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from collector service:', errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();
    console.log('Response from collector service:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
