import gsap from "gsap";
import type { LottieController } from "../components/scrub-lottie";
import { REGIONS } from "./landing-content";

/**
 * Scroll choreography. Cover/reveal transitions come for free from the sticky
 * stack + z-index (see section-layer / Z), so these functions only handle the
 * in-panel animations: scrubbed assembly, the Lottie scrub, and entrance fades.
 *
 * Every function is called from the orchestrator's `useGSAP` / `matchMedia`
 * callback, so the GSAP objects are tracked and reverted automatically.
 */

const q = (el: ParentNode, sel: string) => el.querySelector<HTMLElement>(sel);
const qa = (el: ParentNode, sel: string) =>
  gsap.utils.toArray<HTMLElement>(el.querySelectorAll(sel));

/** Smoothing lag — gives scroll a springy, "tactile" feel instead of 1:1 linear. */
const SCRUB = 1.1;
/** End a scrub at the end of a section's pinned dwell (regionVh - 100vh). */
const dwellEnd = (regionVh: number) => `+=${regionVh - 100}%`;

/**
 * Section 1→2: a single pinned sequence that bridges hero into bento.
 * (1) the base hero video clips into a padded, rounded card (`inset(20px round
 * 20px)` matches the panel's px-5 padding + slots' rounded-2xl), then (2) the six
 * slots assemble on top, top row first (`data-order`: 0 = top, 1 = row 4, 2 = row
 * 5) so hero and bento read as one continuous scene with minimal empty dwell.
 */
export function createBentoScrub(root: HTMLElement) {
  const section = q(root, "#bento");
  if (!section) return;
  const slots = qa(section, "[data-bento-slot]");
  if (!slots.length) return;
  const heroVideo = q(section, "[data-hero-video]");

  const STEP = 0.12;
  gsap.set(slots, { autoAlpha: 0, y: 70, scale: 0.88 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: dwellEnd(REGIONS.bento),
      scrub: SCRUB,
    },
  });
  // 1) hero video clips into a card
  if (heroVideo) {
    tl.fromTo(
      heroVideo,
      { clipPath: "inset(0px round 0px)" },
      { clipPath: "inset(20px round 20px)", ease: "none", duration: 0.4 },
    );
  }
  // 2) slots assemble over it, top row first
  tl.to(
    slots,
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      ease: "power3.out",
      duration: 0.6,
      stagger: (_i: number, el: HTMLElement) => Number(el.dataset.order ?? 0) * STEP,
    },
    ">-0.1",
  );
}

/** Section 3: fade in the copy and scrub the background Lottie across the dwell. */
export function createIntroScrub(root: HTMLElement, getLottie: () => LottieController | null) {
  const section = q(root, "#intro");
  if (!section) return;
  const content = q(section, "[data-intro-content]");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: dwellEnd(REGIONS.intro),
      scrub: SCRUB,
      onUpdate: (self) => {
        const lottie = getLottie();
        if (lottie?.totalFrames) {
          lottie.goToAndStop(self.progress * (lottie.totalFrames - 1), true);
        }
      },
    },
  });
  if (content) {
    tl.from(content, { autoAlpha: 0, y: 56, ease: "power2.out", duration: 0.5 }).to(
      {},
      { duration: 0.5 },
    );
  }
}

/** Fade element groups in sequence (text first, then graphic) when a section sticks. */
function fadeInSequence(section: HTMLElement, groups: HTMLElement[][]) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none reverse" },
  });
  groups.forEach((group, index) => {
    if (!group.length) return;
    gsap.set(group, { autoAlpha: 0, y: 48 });
    tl.to(
      group,
      { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.8 },
      index === 0 ? 0 : "-=0.5",
    );
  });
}

/** Desktop entrance animations for the non-scrubbed sections. */
export function createDesktopEntrances(root: HTMLElement) {
  // Section 4: value cards rise in parallel with a small stagger.
  const cards = qa(root, "#values [data-value-card]");
  if (cards.length) {
    gsap.set(cards, { autoAlpha: 0, y: 70 });
    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.16,
      ease: "power3.out",
      duration: 0.9,
      scrollTrigger: {
        trigger: q(root, "#values"),
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // Sections 5 & 6: text first, then the graphic block.
  const showcase = q(root, "#showcase");
  if (showcase) {
    fadeInSequence(showcase, [
      qa(showcase, "[data-showcase-heading]"),
      qa(showcase, "[data-showcase-rows]"),
    ]);
  }
  const blog = q(root, "#blog");
  if (blog) {
    fadeInSequence(blog, [qa(blog, "[data-blog-text]"), qa(blog, "[data-blog-cards]")]);
  }
}

/** Lightweight fallback: fade content in on enter, no pinning or scrubbing. */
export function createMobileReveals(root: HTMLElement) {
  const groups = [
    qa(root, "#bento [data-bento-slot]"),
    qa(root, "#intro [data-intro-content]"),
    qa(root, "#values [data-value-card]"),
    qa(root, "#showcase [data-showcase-heading]"),
    qa(root, "#showcase [data-showcase-rows]"),
    qa(root, "#blog [data-blog-text]"),
    qa(root, "#blog [data-blog-cards]"),
  ];
  for (const group of groups) {
    if (!group.length) continue;
    const trigger = group[0]?.closest("[data-section]") ?? group[0];
    gsap.set(group, { autoAlpha: 0, y: 32 });
    gsap.to(group, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      ease: "power2.out",
      duration: 0.6,
      scrollTrigger: { trigger, start: "top 80%", toggleActions: "play none none reverse" },
    });
  }
}

/**
 * Section 7: footer panel grows from 100dvh to 150dvh as it's scrolled into, so it
 * fills the viewport on entry (no empty gap) then opens up. Content stays bottom-
 * anchored via the panel's `justify-end`.
 */
export function createFooterExpand(root: HTMLElement) {
  const section = q(root, "#footer");
  if (!section) return;
  const panel = section.firstElementChild;
  if (!panel) return;
  gsap.fromTo(
    panel,
    { height: "100dvh" },
    {
      height: "150dvh",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: dwellEnd(REGIONS.footer),
        scrub: SCRUB,
        invalidateOnRefresh: true,
      },
    },
  );
}
