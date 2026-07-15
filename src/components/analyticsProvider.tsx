"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function AnalyticsProvider() {
  useEffect(() => {
    void trackEvent({ type: "visit" });
  }, []);
  return null;
}
