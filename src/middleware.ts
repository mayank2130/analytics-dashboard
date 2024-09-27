import { NextRequest, NextResponse } from "next/server";
import { analytics } from "./utils/analytics";

export default async function meddileware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    try {
      analytics.track("pageview", {
        page: "/",
        country: req.geo?.country
      });

    } catch (error) {}
  }

  return NextResponse.next();
}

export const matcher = {
  matcher: ["/"],
};
