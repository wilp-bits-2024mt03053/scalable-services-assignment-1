import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const targetUrl = new URL(process.env.NEXT_PUBLIC_API_EVENTS_URL || 'http://real-time-events-service:8001/events');
  
  // Forward all query parameters from the original request
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  console.log(`Received events request for URL: ${targetUrl.toString()}`);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from events service:', errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();
    console.log('Response from events service:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return new NextResponse('Error proxying request', { status: 500 });
  }
}
