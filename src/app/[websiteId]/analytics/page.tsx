import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { analytics } from "@/utils/analytics";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { websiteId: string } }) => {
  const { websiteId } = params;
  const TRACKING_DAYS = 7;

  try {
    const {
      avgVisitorsPerDay,
      amtVisitorsToday,
      timeseriesPageviews,
      topCountries,
    } = await analytics.getWebsiteStats(websiteId, TRACKING_DAYS);

    return (
      <div className="min-h-screen w-full py-12 flex justify-center items-center">
        <div className="relative w-full max-w-6xl mx-auto text-white">
          <AnalyticsDashboard
            avgVisitorsPerDay={avgVisitorsPerDay}
            amtVisitorsToday={amtVisitorsToday}
            timeseriesPageviews={timeseriesPageviews}
            topCountries={topCountries}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    notFound();
  }
};

export default Page;
