// pages/api/analytics.ts or app/api/analytics/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { analytics } from '@/utils/analytics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle tracking
    const { event, url, referrer, userAgent, language, timestamp, websiteId } = req.body;

    try {
      await analytics.track(`${websiteId}:${event}`, {
        url,
        referrer,
        userAgent,
        language,
        timestamp,
        country: req.headers['x-vercel-ip-country'] || 'Unknown'
      });

      res.status(200).json({ message: 'Analytics tracked successfully' });
    } catch (error) {
      console.error('Failed to track analytics:', error);
      res.status(500).json({ message: 'Failed to track analytics' });
    }
  } else if (req.method === 'GET') {
    // Handle fetching analytics
    const { websiteId } = req.query;
    const TRACKING_DAYS = 7;

    try {
      const stats = await analytics.getWebsiteStats(websiteId as string, TRACKING_DAYS);
      res.status(200).json(stats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}