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

/** Section 2: assemble the six bento slots across the pinned dwell. */
export function createBentoScrub(root: HTMLElement) {
  const section = q(root, "#bento");
  if (!section) return;
  const slots = qa(section, "[data-bento-slot]");
  if (!slots.length) return;

  gsap.set(slots, { autoAlpha: 0, y: 70, scale: 0.88 });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: dwellEnd(REGIONS.bento),
        scrub: SCRUB,
      },
    })
    .to(slots, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.14, ease: "power3.out" });
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
