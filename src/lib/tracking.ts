// Centralized analytics / ads tracking helpers.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fires a Google Ads conversion event for a lead submission.
 * Add a `send_to` (e.g. "AW-17886502668/CONVERSION_LABEL") later
 * once a conversion label is configured in Google Ads.
 */
export function trackLeadConversion(extra?: Record<string, unknown>) {
  try {
    if (typeof window === "undefined" || !window.gtag) return;
    // Generic conversion event — works without a specific label.
    window.gtag("event", "generate_lead", {
      send_to: "AW-17886502668",
      event_category: "engagement",
      event_label: "homepage_lead_form",
      ...extra,
    });
  } catch (e) {
    // Never let tracking break the UX
    console.warn("trackLeadConversion failed:", e);
  }
}
