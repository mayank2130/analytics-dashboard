'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const searchParams = useSearchParams();
  const websiteId = searchParams.get('websiteId');

  useEffect(() => {
    if (!websiteId) return;

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics?websiteId=${websiteId}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      }
    };

    fetchAnalytics();
  }, [websiteId]);

  if (!websiteId) return <div>Missing website ID</div>;
  if (!analyticsData) return <div>Loading analytics...</div>;

  return (
    <div className="min-h-screen w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-6xl mx-auto text-white">
        <AnalyticsDashboard
        // @ts-expect-error: Should expect string
        websiteId={websiteId}
        // @ts-expect-error: Should expect string
        avgVisitorsPerDay={analyticsData.avgVisitorsPerDay}
        // @ts-expect-error: Should expect string
        amtVisitorsToday={analyticsData.amtVisitorsToday}
        // @ts-expect-error: Should expect string
        timeseriesPageviews={analyticsData.timeseriesPageviews}
        // @ts-expect-error: Should expect string
          topCountries={analyticsData.topCountries}
        />
      </div>
    </div>
  );
}