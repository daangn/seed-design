"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useMemo, useRef, useState } from "react";
import type { LottieController } from "./components/scrub-lottie";
import { CustomCursor } from "./custom-cursor";
import { LandingHeader, type HeaderVariant } from "./landing-header";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "./lib/landing-content";
import {
  createBentoScrub,
  createDesktopEntrances,
  createHeroToBento,
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

/** Header appearance per section. Unified to a single solid look; footer hides it. */
const SECTION_VARIANT: Record<string, HeaderVariant> = {
  hero: "transparent",
  bento: "solid",
  intro: "solid",
  values: "solid",
  showcase: "solid",
  blog: "solid",
  footer: "hidden",
};

export function LandingExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const introLottieRef = useRef<LottieController | null>(null);
  const [variant, setVariant] = useState<HeaderVariant>("transparent");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      // Smooth scroll (Lenis) synced to ScrollTrigger + GSAP's ticker. No scroll
      // resistance/snapping — the page flows naturally; only intro scrubs a Lottie.
      let lenis: Lenis | null = null;
      let onTick: ((time: number) => void) | null = null;
      if (!prefersReduced) {
        lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        onTick = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);
      }

      // Header state machine: switch only once a section reaches the top. The footer
      // is a fixed layer uncovered by the spacer, so hide the header the moment that
      // reveal begins (spacer enters from the viewport bottom) instead of at the top.
      const sectionEls = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-section]"));
      for (const section of sectionEls) {
        const next = SECTION_VARIANT[section.dataset.section ?? ""];
        if (!next) continue;
        const isFooterReveal = section.dataset.section === "footer";
        ScrollTrigger.create({
          trigger: section,
          start: isFooterReveal ? "top bottom" : "top top",
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
          createHeroToBento(root);
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
      </>
    ),
    [handleLottieReady],
  );

  return (
    <main ref={rootRef} data-landing="true" className="relative w-full bg-palette-carrot-600">
      <LandingHeader variant={variant} />
      <CustomCursor />
      {/* Lowest layer: fixed to the screen bottom. Every section above is opaque and
          covers it until they scroll off. */}
      <SectionFooter />
      {sectionTree}
      {/* Curtain reveal: the stack above scrolls up across this gap, uncovering the
          fixed footer from the bottom up. Also the footer's header-hide trigger. */}
      <div data-section="footer" aria-hidden className="h-dvh w-full" />
    </main>
  );
}
