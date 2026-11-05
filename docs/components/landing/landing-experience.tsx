"use client";

import { useGSAP } from "@gsap/react";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LottieController } from "./components/scrub-lottie";
import { CustomCursor } from "./custom-cursor";
import { LANDING_LIGHT_ONLY_COLOR_BRIDGE } from "./landing-theme";
import { LandingHeader, type HeaderVariant } from "./landing-header";
import { LandingResponsiveSections } from "./landing-responsive-sections";
import { DARK_BG, INTRO_QUERY, MOBILE_QUERY, WIDE_LAYOUT_QUERY } from "./lib/landing-content";
import { useLandingEnvironment } from "./lib/landing-environment";
import {
  armEntranceSnaps,
  attachEntranceRefreshSnap,
  attachEntranceResizeSettle,
  attachEntranceScrollSettle,
  beginEntranceBuild,
  createBentoScrub,
  createDesktopEntrances,
  createHeroToBento,
  createIntroScrub,
  createIntroValuesCrossfade,
  createMobileReveals,
  createValuesReveal,
  createValuesScrub,
  settleEntrances,
} from "./lib/scenes";
import { SectionBlog } from "./sections/section-blog";
import { SectionFooter } from "./sections/section-footer";
import { SectionShowcase } from "./sections/section-showcase";
import { SectionValues } from "./sections/section-values";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function LandingExperience() {
  const rootRef = useRef<HTMLElement>(null);
  /** First build = plain page load, so entrances animate; later builds are resize rebuilds. */
  const isFirstBuildRef = useRef(true);
  const introLottieRef = useRef<LottieController | null>(null);
  const introLottieProgressRef = useRef(0);
  const valuesLottieRefs = useRef<(LottieController | null)[]>([]);
  const environment = useLandingEnvironment();
  const automaticMotionEnabled = environment.resolved && !environment.prefersReducedMotion;
  const searchOpenRef = useRef(false);
  // Header morph: expanded at the very top, gathered into the pill once scrolled, hidden
  // over the footer. Two independent scroll signals compose into `variant` (below).
  const [collapsed, setCollapsed] = useState(false);
  const [footerHidden, setFooterHidden] = useState(false);
  const [tone, setTone] = useState<"black" | "white">("black");
  // Footer is sized to its content; the spacer that uncovers it tracks this height.
  const [footerH, setFooterH] = useState<number | null>(null);
  // Search dialog open-state (fumadocs SearchContext) — drives the Lenis prevent() below.
  const { open: searchOpen } = useSearchContext();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !environment.resolved) return;

      // The footer is fixed and sized to its own content. The spacer below the
      // section stack uncovers it, so its height must track the footer's — that way
      // the footer opens just far enough to show logo / Menu / Contact, never a full
      // screen. Re-measure on resize (the wordmark scales with viewport width).
      const footer = root.querySelector<HTMLElement>("#footer");
      let footerRO: ResizeObserver | null = null;
      if (footer) {
        footerRO = new ResizeObserver(() => {
          setFooterH(footer.offsetHeight);
          ScrollTrigger.refresh();
        });
        footerRO.observe(footer);
      }

      const prefersReduced = environment.prefersReducedMotion;

      // Smooth scroll (Lenis) synced to ScrollTrigger + GSAP's ticker. No scroll
      // resistance/snapping — the page flows naturally; only intro scrubs a Lottie.
      let lenis: Lenis | null = null;
      let onTick: ((time: number) => void) | null = null;
      if (!prefersReduced) {
        // Two independent axes:
        //  - lerp: the inertial "stickiness" (Lenis's signature glide). Lower =
        //    more drawn-out settle. lenis.dev default ≈ 0.1; 0.06–0.08 = chewier.
        //  - wheelMultiplier: raw speed. Lower = slower/heavier (more travel to
        //    advance). Adds weight, NOT stickiness. lenis.dev leaves it at 1.
        lenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
          wheelMultiplier: 0.7,
          touchMultiplier: 0.7,
          // While the search dialog is open, hand wheel/touch back to the browser so
          // Radix's scroll-lock freezes the background (and lets the results list scroll)
          // — WITHOUT stopping Lenis. Keeping Lenis running preserves its ScrollTrigger
          // sync, so scrubbed reveals (e.g. the 04 Values title) never snap back to hidden.
          prevent: () => searchOpenRef.current,
        });
        lenis.on("scroll", ScrollTrigger.update);
        onTick = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        // ponytail: preview-only debug handles, opt-in via `?landingDebug`. Lets us drive
        // scroll deterministically (window.__lenis.scrollTo(y)) to fire reveals, and inspect
        // triggers (window.__ST.getAll()). Re-assigned each rebuild so it's always current.
        // MIRROR-ONLY — remove before exporting to daangn.
        if (new URLSearchParams(window.location.search).has("landingDebug")) {
          Object.assign(window, { __lenis: lenis, __ST: ScrollTrigger });
        }
      }

      const sectionEls = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-section]"));

      const createHeaderToneTrigger = (selector: "#intro" | "#values") => {
        const whiteStart = root.querySelector<HTMLElement>(selector);
        if (!whiteStart) return;

        // offsetTop은 레이아웃 의존이라 onRefresh에서만 읽어 캐시하고, onUpdate는 비교만 한다.
        let threshold = whiteStart.offsetTop;
        const updateTone = (scrollY: number) => {
          setTone(scrollY >= threshold ? "white" : "black");
        };

        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onRefresh: (self) => {
            threshold = whiteStart.offsetTop;
            updateTone(self.scroll());
          },
          onUpdate: (self) => updateTone(self.scroll()),
        });
      };

      // Header collapse: expanded only at the very top, gathered into the pill the moment
      // the page scrolls (same behavior as the docs header). Lenis drives the scroll, so
      // read the position through ScrollTrigger (self.scroll()), never raw window.scrollY.
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setCollapsed(self.scroll() > 8),
      });

      // Footer hides the header: the fixed footer (md+) is uncovered by the flow spacer,
      // so hide the moment that reveal begins (spacer enters from the viewport bottom).
      // The fixed footer and the flow spacer share data-section="footer"; skip the fixed
      // one so the spacer drives it. On mobile the footer is in-flow.
      for (const section of sectionEls) {
        if (section.dataset.section !== "footer") continue;
        if (!section.getClientRects().length) continue;
        if (getComputedStyle(section).position === "fixed") continue;
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => setFooterHidden(self.isActive),
        });
      }

      createHeaderToneTrigger(environment.layout === "desktop" ? "#intro" : "#values");

      const mm = gsap.matchMedia();

      // Layout choreography (md+): hero/bento scrub, values card reveals, showcase/blog
      // entrances. No intro dependency, so it runs at tablet too. Below md → light mobile
      // reveals. reduced-motion → static.
      if (!prefersReduced) {
        // Reset the entrance registry before (re)building so the settle pass below only
        // sees this build's timelines (stateless across rebuilds).
        beginEntranceBuild(root);

        // isMobile must be listed even though the body only branches on isWide:
        // gsap.matchMedia runs the callback only when a listed condition is true, so
        // without a mobile query the callback (and createMobileReveals) never fires on
        // phones. isMobile OR isWide is always true → the callback always runs.
        mm.add({ isWide: WIDE_LAYOUT_QUERY, isMobile: MOBILE_QUERY }, (ctx) => {
          const conditions = ctx.conditions ?? {};
          if (conditions.isWide) {
            // Values Lottie scrub is md+ only; the mobile one-column flow keeps the
            // static webp poster (see ValueMotion), so no controller exists below md.
            createValuesScrub(root, (index) => valuesLottieRefs.current[index]);
            createHeroToBento(root);
            createBentoScrub(root);
            createValuesReveal(root);
            createDesktopEntrances(root);
          } else {
            // Mobile: play-once entrances (word masks + fades) plus each Values card's
            // Lottie played once on reveal — the controllers arrive async, so read them
            // late via the accessor (same pattern as the desktop scrub).
            createMobileReveals(root, (index) => valuesLottieRefs.current[index] ?? null);
          }
        });

        // Intro-coupled choreography: the 03 Intro Lottie scrub and the 03→04 crossfade
        // exist only at lg+ (the intro stage is `hidden lg:block`, and Values' -140dvh
        // overlap is lg-gated to match). Keeping this on INTRO_QUERY guarantees these
        // triggers never attach to a hidden #intro at tablet.
        mm.add({ isLg: INTRO_QUERY }, (ctx) => {
          const conditions = ctx.conditions ?? {};
          if (conditions.isLg) {
            createIntroScrub(
              root,
              () => introLottieRef.current,
              (progress) => {
                introLottieProgressRef.current = progress;
              },
            );
            createIntroValuesCrossfade(root);
          }
        });

        // Both branches have (re)built their reveals. Snap any that the current scroll already
        // passed — or that a pinned/just-resized layout presents on screen right now — straight
        // to shown, so a breakpoint rebuild never strands on-screen text hidden.
        settleEntrances();
      }

      // A drag finishes settling AFTER this callback (scroll clamp, Lenis easing, ScrollTrigger's
      // own debounced refresh), so keep settling on every later refresh — but only once this
      // session has actually resized, so a plain first load still plays its entrances.
      if (!isFirstBuildRef.current) armEntranceSnaps();
      isFirstBuildRef.current = false;
      const detachRefreshSnap = attachEntranceRefreshSnap();
      // …and one final pass once the drag stops, which is the only moment the geometry is final.
      // It also covers same-bucket drags (and mobile URL-bar height changes), which never rebuild.
      const detachResizeSettle = attachEntranceResizeSettle();
      // …and while scrolling, for a section reached from below (or jumped past) after a resize.
      const detachScrollSettle = attachEntranceScrollSettle();

      return () => {
        detachRefreshSnap();
        detachResizeSettle();
        detachScrollSettle();
        mm.revert();
        footerRO?.disconnect();
        if (onTick) gsap.ticker.remove(onTick);
        lenis?.destroy();
      };
    },
    {
      scope: rootRef,
      dependencies: [
        environment.layout,
        environment.mode,
        environment.prefersReducedMotion,
        environment.resolved,
      ],
      revertOnUpdate: true,
    },
  );

  // Keep the Lenis prevent() predicate (in the config above) in sync with the dialog's
  // open state. When open, Lenis ignores wheel/touch so Radix's scroll-lock freezes the
  // background while Lenis keeps running — which preserves ScrollTrigger sync so the
  // scrubbed section reveals (e.g. the 04 Values title) don't reset while it's open.
  useEffect(() => {
    searchOpenRef.current = searchOpen;
  }, [searchOpen]);

  // Mobile: mirror the browser edge / safe-area background to the section tone. iOS
  // Safari samples the toolbar tint from a fixed/sticky edge element, else from <body>
  // (see global.css) — and the footer is in-flow on mobile, so <body> is what shows. A
  // single body color can only follow ONE edge, so it tracks the top: white over the
  // light Bento top, dark (#121212) once the dark sections begin (same #values boundary
  // as the header tone). The footer's orange stays in its own content. Desktop resets to
  // the CSS white pin. Verified locally as a body-bg flip; the actual iOS tint needs a device.
  useEffect(() => {
    if (environment.layout !== "mobile") {
      document.body.style.backgroundColor = "";
      return;
    }
    document.body.style.backgroundColor = tone === "white" ? DARK_BG : "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [tone, environment.layout]);

  const handleLottieReady = useCallback((controller: LottieController | null) => {
    introLottieRef.current = controller;
    if (controller?.totalFrames) {
      controller.goToAndStop(introLottieProgressRef.current * (controller.totalFrames - 1), true);
    }
  }, []);

  const handleValueLottieReady = useCallback(
    (index: number, controller: LottieController) => {
      valuesLottieRefs.current[index] = controller;
      // Mobile plays each card's Lottie once on reveal. If the card already scrolled into
      // view before its Lottie finished loading, that reveal's goToAndPlay was a no-op
      // (the controller was still null) — catch up by playing it now. Desktop scrubs, so
      // it must stay paused here.
      if (environment.layout !== "mobile") return;
      const card = rootRef.current?.querySelectorAll<HTMLElement>("#values [data-value-card]")[
        index
      ];
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) controller.goToAndPlay(0, true);
    },
    [environment.layout],
  );

  const variant: HeaderVariant = footerHidden ? "hidden" : collapsed ? "collapsed" : "expanded";

  // Only the header consumes `variant`; memoize the section tree so a header morph
  // doesn't re-render all seven section subtrees (videos, Lottie, marquees).
  const sectionTree = useMemo(
    () => (
      <>
        <LandingResponsiveSections
          environmentResolved={environment.resolved}
          layout={environment.layout}
          onLottieReady={handleLottieReady}
          prefersReducedMotion={environment.prefersReducedMotion}
        />
        {environment.resolved && (
          <>
            <SectionValues
              motionEnabled={automaticMotionEnabled}
              onValueLottieReady={handleValueLottieReady}
            />
            <SectionShowcase motionEnabled={automaticMotionEnabled} />
            <SectionBlog />
          </>
        )}
      </>
    ),
    [
      automaticMotionEnabled,
      environment.layout,
      environment.prefersReducedMotion,
      environment.resolved,
      handleLottieReady,
      handleValueLottieReady,
    ],
  );

  return (
    <main
      ref={rootRef}
      data-landing="true"
      data-seed-color-mode="light-only"
      // Page background is the dark tone (#121212), NOT carrot: every section paints its
      // own opaque bg over this, so this only shows through the 1px sub-pixel seams where
      // sections meet. Dark there = seams stay invisible (a carrot page bg leaked orange
      // hairlines at every boundary, and behind Hero's white stage). Sections that need
      // carrot (footer) or white (hero/bento) set it themselves; blog's rounded bottom
      // reveals the carrot footer directly. Safe-area tint is the separate body bg above.
      className={`relative w-full overflow-x-clip bg-[#121212] ${LANDING_LIGHT_ONLY_COLOR_BRIDGE}`}
    >
      <LandingHeader variant={variant} tone={tone} />
      {automaticMotionEnabled && environment.mode === "desktop" && <CustomCursor />}
      {sectionTree}
      {/* Desktop curtain (md+): the stack above scrolls up across this gap, uncovering the
          fixed footer from the bottom up. Height tracks the footer's content height
          (measured in useGSAP) so it opens only that far. Also the footer's header-hide
          trigger on desktop. Hidden on mobile, where the footer is in normal flow. */}
      {environment.layout !== "mobile" && (
        <div
          data-section="footer"
          aria-hidden
          className="w-full"
          style={{ height: footerH ?? "100dvh" }}
        />
      )}
      {/* Footer: in-flow on mobile (plain scroll — no fixed element, so iOS Safari 26's
          toolbar samples the white body instead of the footer's orange), fixed curtain
          layer on md+. */}
      {environment.resolved && <SectionFooter />}
    </main>
  );
}
