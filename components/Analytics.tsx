/**
 * Client-side analytics. Reads NEXT_PUBLIC_* env vars at build time;
 * if neither set, renders nothing.
 *
 * Turn on by setting any of:
 *   NEXT_PUBLIC_CF_BEACON     — Cloudflare Web Analytics token
 *   NEXT_PUBLIC_POSTHOG_KEY   — PostHog project API key (phc_...)
 *   NEXT_PUBLIC_POSTHOG_HOST  — PostHog host (default: https://eu.i.posthog.com)
 *
 * PostHog loads via CDN array.js (no npm dep), then we initialise it on mount.
 * Init values come from controlled env vars, never user input.
 */
"use client";

import { useEffect } from "react";
import Script from "next/script";

const CF_BEACON = process.env.NEXT_PUBLIC_CF_BEACON;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

type PosthogShim = {
  init: (key: string, opts: Record<string, unknown>) => void;
  capture: (event: string, props?: Record<string, unknown>) => void;
  _i?: unknown[];
  __SV?: number;
};

declare global {
  interface Window {
    posthog?: PosthogShim;
  }
}

export function Analytics() {
  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === "undefined") return;
    if (window.posthog && window.posthog.__SV) return; // already inited

    // Set up PostHog stub before array.js loads. The CDN script then attaches
    // real methods. Anything we call before load is queued via _i.
    const ph: PosthogShim = window.posthog || ({} as PosthogShim);
    ph._i = ph._i || [];
    const methods = [
      "init",
      "capture",
      "register",
      "identify",
      "alias",
      "reset",
      "group",
      "onFeatureFlags",
    ];
    methods.forEach((m) => {
      (ph as unknown as Record<string, unknown>)[m] = (
        ...args: unknown[]
      ): void => {
        ph._i!.push([m, ...args]);
      };
    });
    window.posthog = ph;
    ph.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  return (
    <>
      {CF_BEACON && (
        <Script
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${CF_BEACON}"}`}
        />
      )}
      {POSTHOG_KEY && (
        <Script
          strategy="afterInteractive"
          src={`${POSTHOG_HOST.replace(".i.posthog.com", "-assets.i.posthog.com")}/static/array.js`}
        />
      )}
    </>
  );
}

/** Fire a PostHog event if posthog is initialised (or queued). No-op otherwise. */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(event, props);
  }
}
