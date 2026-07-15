"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import SitePresenceTracker from "@/lib/sitePresence";

export default function AnalyticsProvider() {
  useEffect(() => {
    void trackEvent({ type: "visit" });
  }, []);
  return <SitePresenceTracker />;
}
