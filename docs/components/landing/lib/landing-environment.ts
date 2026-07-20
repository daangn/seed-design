"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DESKTOP_QUERY, WIDE_LAYOUT_QUERY } from "./landing-content";

export type LandingMode = "compact" | "desktop";
export type LandingLayout = "mobile" | "tablet" | "desktop";

export interface LandingEnvironment {
  layout: LandingLayout;
  mode: LandingMode;
  prefersReducedMotion: boolean;
  resolved: boolean;
}

type LandingViewportEnvironment = Omit<LandingEnvironment, "prefersReducedMotion">;

const SERVER_ENVIRONMENT: LandingViewportEnvironment = {
  layout: "mobile",
  mode: "compact",
  resolved: false,
};

export function useLandingEnvironment(): LandingEnvironment {
  const [environment, setEnvironment] = useState<LandingViewportEnvironment>(SERVER_ENVIRONMENT);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const wideLayoutQuery = window.matchMedia(WIDE_LAYOUT_QUERY);
    const desktopQuery = window.matchMedia(DESKTOP_QUERY);

    const updateEnvironment = () => {
      const next: LandingViewportEnvironment = {
        layout: desktopQuery.matches ? "desktop" : wideLayoutQuery.matches ? "tablet" : "mobile",
        mode: desktopQuery.matches ? "desktop" : "compact",
        resolved: true,
      };

      setEnvironment((current) =>
        current.layout === next.layout &&
        current.mode === next.mode &&
        current.resolved === next.resolved
          ? current
          : next,
      );
    };

    updateEnvironment();
    wideLayoutQuery.addEventListener("change", updateEnvironment);
    desktopQuery.addEventListener("change", updateEnvironment);

    return () => {
      wideLayoutQuery.removeEventListener("change", updateEnvironment);
      desktopQuery.removeEventListener("change", updateEnvironment);
    };
  }, []);

  return { ...environment, prefersReducedMotion };
}
