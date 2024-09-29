import { NextRequest, NextResponse } from 'next/server';
import { analytics } from '@/utils/analytics';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const event = formData.get('event') as string;
  const url = formData.get('url') as string;
  const referrer = formData.get('referrer') as string;
  const userAgent = formData.get('userAgent') as string;
  const language = formData.get('language') as string;
  const timestamp = formData.get('timestamp') as string;
  const websiteId = formData.get('websiteId') as string;

  try {
    await analytics.track(`${websiteId}:${event}`, {
      url,
      referrer,
      userAgent,
      language,
      timestamp,
      country: request.geo?.country || 'Unknown'
    });

    return NextResponse.json({ message: 'Analytics tracked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to track analytics:', error);
    return NextResponse.json({ message: 'Failed to track analytics' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get('websiteId');
  const TRACKING_DAYS = 7;

  if (!websiteId) {
    return NextResponse.json({ message: 'Missing websiteId parameter' }, { status: 400 });
  }

  try {
    const stats = await analytics.getWebsiteStats(websiteId, TRACKING_DAYS);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ message: 'Failed to fetch analytics' }, { status: 500 });
  }
}