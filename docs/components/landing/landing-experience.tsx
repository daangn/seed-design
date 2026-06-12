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
  createFooterExpand,
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

/**
 * Scroll resistance over the bento "rest" beat: once the grid is assembled, wheel
 * delta is damped to a crawl until a small budget is spent, then normal scroll
 * resumes — a deliberate pause without fully locking the page.
 */
const RESIST_FACTOR = 0.06;
const RESIST_THRESHOLD = 90;

export function LandingExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const introLottieRef = useRef<LottieController | null>(null);
  const [variant, setVariant] = useState<HeaderVariant>("transparent");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      // Mutable gate shared by the Lenis input hook and the toggle trigger below.
      const resist = { active: false, budget: 0 };

      // Smooth, "sticky" scroll (Lenis) synced to ScrollTrigger + GSAP's ticker.
      let lenis: Lenis | null = null;
      let onTick: ((time: number) => void) | null = null;
      if (!prefersReduced) {
        lenis = new Lenis({
          duration: 1.15,
          smoothWheel: true,
          // Damp downward input while resisting; spend the budget, then release.
          virtualScroll: (data) => {
            if (resist.active && data.deltaY > 0) {
              resist.budget -= Math.abs(data.deltaY);
              if (resist.budget > 0) data.deltaY *= RESIST_FACTOR;
              else resist.active = false;
            }
            return true;
          },
        });
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
          createFooterExpand(root);

          // Once the bento has assembled (end of its dwell), briefly resist scroll.
          const bento = root.querySelector("#bento");
          if (bento) {
            ScrollTrigger.create({
              trigger: bento,
              start: "top top-=50%",
              end: "top top-=65%",
              onToggle: (self) => {
                resist.active = self.isActive;
                if (self.isActive) resist.budget = RESIST_THRESHOLD;
              },
            });
          }
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
      <CustomCursor />
      {sectionTree}
    </main>
  );
}
