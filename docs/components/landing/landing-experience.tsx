"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useMemo, useRef, useState } from "react";
import type { LottieController } from "./components/scrub-lottie";
import { LandingHeader, type HeaderVariant } from "./landing-header";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "./lib/landing-content";
import {
  createBentoScrub,
  createDesktopEntrances,
  createIntroScrub,
  createMobileReveals,
} from "./lib/scenes";
import { SectionBento } from "./sections/section-bento";
import { SectionBlog } from "./sections/section-blog";
import { SectionFooter } from "./sections/section-footer";
import { SectionHero } from "./sections/section-hero";
import { SectionLottieIntro } from "./sections/section-lottie-intro";
import { SectionShowcase } from "./sections/section-showcase";
import { SectionValues } from "./sections/section-values";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Header appearance per section. */
const SECTION_VARIANT: Record<string, HeaderVariant> = {
  hero: "compact",
  bento: "expanded-light",
  intro: "dark-translucent",
  values: "dark-translucent",
  showcase: "dark-translucent",
  blog: "expanded-light",
  footer: "compact",
};

/**
 * Landing page orchestrator. Owns the GSAP context (scoped to the root), the
 * morphing-header state machine, the Lenis smooth-scroll loop, and the
 * responsive scroll choreography.
 */
export function LandingExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const introLottieRef = useRef<LottieController | null>(null);
  const [variant, setVariant] = useState<HeaderVariant>("compact");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      // Smooth, "sticky" scroll (Lenis) synced to ScrollTrigger + GSAP's ticker.
      let lenis: Lenis | null = null;
      let onTick: ((time: number) => void) | null = null;
      if (!prefersReduced) {
        lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        onTick = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);
      }

      // Header state machine: switch only once a section reaches the top.
      const sectionEls = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-section]"));
      for (const section of sectionEls) {
        const next = SECTION_VARIANT[section.dataset.section ?? ""];
        if (!next) continue;
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) setVariant(next);
          },
        });
      }

      // In-panel animations: desktop full treatment, mobile light fallback,
      // reduced-motion static.
      const mm = gsap.matchMedia();
      mm.add({ isDesktop: DESKTOP_QUERY, reduce: REDUCED_MOTION_QUERY }, (ctx) => {
        const conditions = ctx.conditions ?? {};
        if (conditions.reduce) return;
        if (conditions.isDesktop) {
          createBentoScrub(root);
          createIntroScrub(root, () => introLottieRef.current);
          createDesktopEntrances(root);
        } else {
          createMobileReveals(root);
        }
      });

      return () => {
        if (onTick) gsap.ticker.remove(onTick);
        lenis?.destroy();
      };
    },
    { scope: rootRef },
  );

  const handleLottieReady = useCallback((controller: LottieController) => {
    introLottieRef.current = controller;
  }, []);

  // Only the header consumes `variant`; memoize the section tree so a header morph
  // doesn't re-render all seven section subtrees (videos, Lottie, marquees).
  const sectionTree = useMemo(
    () => (
      <>
        <SectionHero />
        <SectionBento />
        <SectionLottieIntro onLottieReady={handleLottieReady} />
        <SectionValues />
        <SectionShowcase />
        <SectionBlog />
        <SectionFooter />
      </>
    ),
    [handleLottieReady],
  );

  return (
    <main ref={rootRef} data-landing="true" className="relative w-full bg-palette-carrot-600">
      <LandingHeader variant={variant} />
      {sectionTree}
    </main>
  );
}
