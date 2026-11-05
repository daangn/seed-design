import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
/** Shared tween for the blog reveal (text masks + image dissolve). */
const BLOG_REVEAL = { ease: "power3.out", duration: 0.7 } as const;

/**
 * Entrance = a reveal that plays ONCE when its section enters (toggle-based), as opposed
 * to a scrub (progress tied to scroll position). Every entrance is built here so it also
 * gets registered for the post-rebuild settle pass (see settleEntrances). Scrubs are NOT
 * routed here — scroll maps their progress directly, so ScrollTrigger.refresh() re-syncs
 * them on its own.
 */
interface EntranceEntry {
  tl: gsap.core.Timeline;
  el: HTMLElement;
}
const entrancePending: EntranceEntry[] = [];

/** Everything a scene may hide: the reveal words, their images, and the bento tiles. */
const REVEAL_SELECTOR = "[data-reveal-word], [data-reveal], [data-bento-slot]";

/**
 * Start a (re)build: drop the registry, and wipe the inline state the OUTGOING build left on every
 * reveal.
 *
 * A rebuild replaces the scenes but not the DOM, and revert doesn't always take its inline styles
 * with it — measured after a resize: a word still carrying `translate(0, 110%)` from the build that
 * was torn down, while the new build's timelines report "finished" because they never touched that
 * node. Nothing owns it, so nothing ever puts it back; the text is simply gone. Trying to detect
 * that afterwards is what kept going wrong — too wide a net and a scrub's text gets yanked out from
 * under it (the reveal visibly replays), too narrow and the stranded words are missed.
 *
 * Clearing up front sidesteps the detection problem entirely: every build starts from the CSS
 * resting state, and each entrance's `fromTo` writes its own `from` immediately after (as does each
 * scrub's `gsap.set`), so nothing is visible in between. Stateless across builds, by design.
 */
export function beginEntranceBuild(root: ParentNode) {
  entrancePending.length = 0;
  gsap.set(qa(root, REVEAL_SELECTOR), { clearProps: "transform,opacity,visibility" });
}

interface EntranceOptions {
  /** ScrollTrigger start, e.g. "top 75%". */
  start: string;
  /** Defaults to "play none none none". Blog / intro title pass a reverse variant. */
  toggleActions?: string;
  /**
   * Re-arm to hidden once the unit has scrolled fully below the viewport so it replays on
   * re-entry (never re-hides while on screen). Default true; pass false when toggleActions
   * already reverses (blog, intro title).
   */
  rearm?: boolean;
  /** Fires when the timeline starts playing (e.g. play a card's Lottie from frame 0). */
  onStart?: () => void;
  /** Extra work when re-armed off-screen (e.g. reset the card's Lottie to frame 0). */
  onRearm?: () => void;
}

/**
 * Build one entrance: a timeline gated by a scroll trigger, optionally re-armed off-screen
 * for replay, and registered for the settle pass. `build` adds the tweens (and their
 * hiding gsap.set) to the timeline.
 */
function createEntrance(
  trigger: HTMLElement,
  { start, toggleActions = "play none none none", rearm = true, onStart, onRearm }: EntranceOptions,
  build: (tl: gsap.core.Timeline) => void,
): gsap.core.Timeline {
  const tl = gsap.timeline({ onStart, scrollTrigger: { trigger, start, toggleActions } });
  build(tl);
  if (rearm) {
    ScrollTrigger.create({
      trigger,
      start: "top bottom",
      onLeaveBack: () => {
        tl.pause(0);
        onRearm?.();
      },
    });
  }
  entrancePending.push({ tl, el: trigger });
  return tl;
}

/**
 * Snap entrances to their end state — timeline-safe (`progress(1)`, so each reveal's own from/to
 * is what renders and GSAP's tracking is never fought).
 *
 * Whether a reveal "should already be showing" is asked of its OWN ScrollTrigger, not guessed from
 * the viewport: an entrance fires at `top 70%`-ish, so a section that has only just appeared at the
 * bottom of the screen is on screen and *correctly* still hidden. Completing it there would eat its
 * entrance; showing it there and letting the trigger fire later replays the whole reveal. So the
 * gate is simply "has the scroll passed this trigger's start".
 *
 * `includeStalled` also settles a timeline frozen PART-WAY (progress strictly between 0 and 1) —
 * the state that parks a word halfway up its mask with the top of the line sliced off. At build
 * time those are left alone (their trigger may be about to play them properly); the post-refresh
 * pass includes them, because by then anything still stalled is stranded.
 */
function snapOnscreenEntrances({
  includeStalled = false,
  ignoreActive = false,
  force = false,
}: {
  includeStalled?: boolean;
  ignoreActive?: boolean;
  force?: boolean;
} = {}) {
  for (const { tl, el } of entrancePending) {
    // `force` also re-runs a timeline that already reads as finished, since after a rebuild
    // "finished" doesn't guarantee the element actually shows it. invalidate() drops the cached
    // from/to first — safe because every entrance now declares an explicit `from`.
    if (!force && tl.progress() === 1) continue;
    // Mid-play is normally left alone so a genuine entrance finishes on its own. The post-drag
    // pass overrides that: by then "still playing" means the resize interrupted it.
    if (!ignoreActive && tl.isActive()) continue;
    if (!force && !includeStalled && tl.progress() > 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue; // not rendered in this bucket
    const st = tl.scrollTrigger;
    // Its turn hasn't come yet → leave it armed so the entrance plays properly.
    if (!st || st.scroll() < st.start) continue;
    if (force) tl.invalidate();
    tl.progress(1);
  }
}

/**
 * Safety net for what the entrance snap can't reach: the SCRUBS. Their progress is scroll-derived,
 * and a burst of rebuilds (dragging across a breakpoint, or jittering right on one) can leave a
 * scrub sitting at its `from` — 03 Intro's copy hidden — even though the scroll is well past its
 * range. They aren't entrances, so `snapOnscreenEntrances` never sees them.
 *
 * Skips anything a tween still targets, which is what keeps it off entrances entirely: one waiting
 * at progress 0 for its trigger is hidden on purpose, and showing it here would make the entrance
 * replay from hidden a moment later. Only a node nothing owns gets written.
 */
function repairStaleReveals() {
  const vh = window.innerHeight;
  const repair = (el: HTMLElement, shown: gsap.TweenVars, useMask: boolean) => {
    if (el.offsetParent === null) return; // not rendered in this bucket (e.g. md:hidden copy)
    const box = (useMask ? (el.parentElement ?? el) : el).getBoundingClientRect();
    if (box.width === 0 || box.top >= vh || box.bottom <= 0) return;
    const cs = getComputedStyle(el);
    const ty = new DOMMatrixReadOnly(cs.transform).m42;
    if (Number(cs.opacity) >= 0.9 && cs.visibility !== "hidden" && Math.abs(ty) <= 2) return;
    if (gsap.getTweensOf(el).length > 0) return;
    gsap.set(el, shown);
  };
  for (const word of qa(document, "[data-reveal-word]"))
    repair(word, { yPercent: 0, y: 0, autoAlpha: 1 }, true);
  for (const img of qa(document, "[data-reveal]")) repair(img, { y: 0, autoAlpha: 1 }, false);
  for (const slot of qa(document, "[data-bento-slot]"))
    repair(slot, { y: 0, scale: 1, autoAlpha: 1 }, false);
}

let entranceSnapsArmed = false;

/**
 * Arm the post-refresh snap. Only a session that has actually resized needs it, and gating on
 * that is what keeps the FIRST load's entrances animating normally instead of snapping flat.
 */
export function armEntranceSnaps() {
  entranceSnapsArmed = true;
}

/**
 * Settle again after every ScrollTrigger refresh, not only at rebuild time. A window drag ends
 * with the scroll clamped, Lenis easing to its new position and ScrollTrigger running its own
 * debounced refresh — all AFTER the rebuild callback has come and gone. A section that lands on
 * screen that way still has its entrance armed and no scroll event coming to fire it, and
 * scrolling further down never helps because its trigger start is already behind you. That is
 * the 04 Values / 06 Blog text staying blank after dragging the window narrow. Returns the
 * detach fn for the build's cleanup.
 */
export function attachEntranceRefreshSnap(): () => void {
  const handler = () => {
    if (entranceSnapsArmed) snapOnscreenEntrances({ includeStalled: true });
  };
  ScrollTrigger.addEventListener("refresh", handler);
  return () => ScrollTrigger.removeEventListener("refresh", handler);
}

/**
 * Keep settling while the viewer scrolls, once this session has resized. A rebuild only settles
 * what is on screen at that moment; a section still below the fold stays armed, and if the viewer
 * then arrives at it from BELOW — scrolling back up — its "play on enter" toggle never fires,
 * because entering upward isn't entering. Same for a jump that lands past the trigger's start.
 *
 * Snap first, repair second: the snap resolves those through the timeline (so a later onEnter has
 * nothing left to play), and the DOM repair only picks up orphans the snap can't own. Throttled,
 * and both passes leave anything still waiting for its trigger alone.
 */
export function attachEntranceScrollSettle(): () => void {
  let queued = false;
  const onScroll = () => {
    if (!entranceSnapsArmed || queued) return;
    queued = true;
    window.setTimeout(() => {
      queued = false;
      snapOnscreenEntrances({ includeStalled: true });
      repairStaleReveals();
    }, 200);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/**
 * Settle once the drag has actually STOPPED. Every refresh during a drag lands while the layout
 * is still moving — and while an entrance is legitimately mid-play — so those passes can't be
 * allowed to finish things, and the entrance ends up frozen part-way instead: opacity already up,
 * word still shoved down inside its mask, i.e. a line with its top sliced off. Debouncing on the
 * last resize event gives one pass where the geometry is final, and there `ignoreActive` applies
 * too: an entrance still running after the drag ended is one the resize interrupted, and settling
 * a resize is meant to be instant anyway (no replay — see settleEntrances).
 */
export function attachEntranceResizeSettle(): () => void {
  let timer = 0;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
      snapOnscreenEntrances({ includeStalled: true, ignoreActive: true, force: true });
      repairStaleReveals();
    }, 250);
  };
  const onResize = () => {
    armEntranceSnaps();
    schedule();
  };
  window.addEventListener("resize", onResize, { passive: true });
  // Re-arm the pass for THIS build as well. When the last resize of a drag crosses a breakpoint
  // it rebuilds, and the rebuild's cleanup clears the pending timer — with no further resize
  // coming, nothing would ever reschedule it and the drag would end unsettled. Scheduling here
  // covers that: each rebuild re-queues the pass, and a still-running drag just re-defers it.
  if (entranceSnapsArmed) schedule();
  return () => {
    window.removeEventListener("resize", onResize);
    window.clearTimeout(timer);
  };
}

/**
 * Run right after a (re)build. `ScrollTrigger.refresh()` recomputes every trigger for the new
 * layout and — once armed — drives the refresh listener above, so stranded/stalled entrances get
 * settled there too (including on the later refreshes a drag produces). The direct call covers
 * the build itself.
 *
 * NOTE: not replaying the entrance after a resize is deliberate, not a bug — a resize continues
 * reading, so re-staggering text the viewer was already on would only distract.
 */
export function settleEntrances() {
  ScrollTrigger.refresh();
  // refresh() recomputes where every trigger sits; update() then re-applies the current scroll to
  // them. The scrubs need that second step — their progress is scroll-derived, so without it one
  // can stay parked at its `from` (03 Intro's copy hidden) after a burst of rebuilds.
  ScrollTrigger.update();
  snapOnscreenEntrances();
}

/**
 * Section 1: the single hero video's frame gains padding + rounded corners as the
 * section pins, turning the full-bleed video into a card. Scrolling on then reveals
 * the bento grid below — one video, framing itself, rather than two stitched clips.
 */
export function createHeroToBento(root: HTMLElement) {
  const section = q(root, "#hero");
  if (!section) return;
  const frame = q(section, "[data-hero-frame]");
  const video = q(section, "[data-hero-video]");
  if (!frame || !video) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: dwellEnd(REGIONS.hero),
      scrub: SCRUB,
    },
  });
  // The frame's padding (white gutter) and the video's own corners round in
  // together, so the video itself becomes the rounded card — not just its frame.
  // Gutter matches the bento grid container exactly: left/right 24px (lg:px-6),
  // top 6px, bottom 18px (hero's bottom 18 + bento's top 6 == 24px, matching
  // the left/right gutter). The card then continues straight into the grid.
  tl.fromTo(
    frame,
    { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
    { paddingLeft: 24, paddingRight: 24, paddingTop: 6, paddingBottom: 18, ease: "none" },
    0,
  );
  tl.fromTo(video, { borderRadius: 0 }, { borderRadius: 16, ease: "none" }, 0);
}

/**
 * Section 2: assemble the six bento slots left-to-right across the dwell.
 * `data-order` groups slots by grid column (0 = leftmost column ... 3 = rightmost) so they
 * appear left-to-right regardless of DOM order.
 */
export function createBentoScrub(root: HTMLElement) {
  const section = q(root, "#bento");
  if (!section) return;
  const slots = qa(section, "[data-bento-slot]");
  if (!slots.length) return;

  // Lift the slots up on entry, left column first — smooth (no bounce/overshoot).
  // STEP widens the gap between columns to sharpen the left→right sequence; the
  // small offset holds the whole reveal back slightly after the section enters.
  // Routed through createEntrance so the tiles are registered for the settle pass — they
  // strand on a breakpoint rebuild exactly like the text reveals do.
  const STEP = 0.2;
  createEntrance(
    section,
    { start: "top 90%", toggleActions: "play none none reverse", rearm: false },
    (tl) => {
      tl.fromTo(
        slots,
        { autoAlpha: 0, y: 80, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
          duration: 0.7,
          stagger: (_i: number, el: HTMLElement) => Number(el.dataset.order ?? 0) * STEP,
          immediateRender: true,
        },
        0.15,
      );
    },
  );
}

/**
 * Section 3: one scrubbed timeline tied to the pinned dwell. Title fades in first,
 * then each description line reveals across the same scrubbed span as the background
 * Lottie frames. The timeline ends at REVEAL so Values can begin dissolving the intro
 * immediately after the Lottie completes.
 */
export function createIntroScrub(
  root: HTMLElement,
  getLottie: () => LottieController | null,
  onProgress?: (progress: number) => void,
) {
  const section = q(root, "#intro");
  if (!section) return;
  const lottie = q(section, "[data-intro-lottie]");
  const titleWords = qa(section, "[data-intro-title] [data-reveal-word]");
  const descriptionLines = qa(section, "[data-intro-description] .block");
  const descriptionLineWords = descriptionLines
    .map((line) => qa(line, "[data-reveal-word]"))
    .filter((words) => words.length > 0);
  const descriptionWords = descriptionLineWords.flat();

  // Lottie zoom + the description reveal scrub together across the FIRST ~80dvh of the
  // pinned dwell and finish there — deliberately before the 03→04 handoff begins, so the
  // last description line is fully up before createIntroValuesCrossfade fades 03 out
  // (its fade-out starts at #values "top 20%", ~10dvh later). Keep this end < that start
  // if you retune either. BUFFER stays at 0 so there is no trailing dead scroll after it.
  const REVEAL = 1.2;
  const BUFFER = 0;
  const LOTTIE_FADE_START = "top 50%";
  const PLAYBACK_START = "top 10%";
  const PLAYBACK_END = "+=80%";
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: PLAYBACK_START,
      end: PLAYBACK_END,
      scrub: SCRUB,
    },
  });
  if (lottie) {
    gsap.set(lottie, { autoAlpha: 0 });
    gsap.to(lottie, {
      autoAlpha: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: LOTTIE_FADE_START,
        end: PLAYBACK_START,
        scrub: true,
      },
    });

    const frame = { t: 0 };
    tl.to(
      frame,
      {
        t: 1,
        ease: "none",
        duration: REVEAL,
        onUpdate: () => {
          onProgress?.(frame.t);
          const l = getLottie();
          if (l?.totalFrames) l.goToAndStop(frame.t * (l.totalFrames - 1), true);
        },
      },
      0,
    );
  }
  if (descriptionWords.length) {
    gsap.set(descriptionWords, { yPercent: 110, autoAlpha: 0 });
    const lineStep = REVEAL / descriptionLineWords.length;
    const wordStagger = 0.012;
    descriptionLineWords.forEach((words, index) => {
      const staggerSpan = wordStagger * Math.max(words.length - 1, 0);
      tl.to(
        words,
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "power3.out",
          duration: Math.max(0.08, lineStep - staggerSpan),
          stagger: wordStagger,
        },
        index * lineStep,
      );
    });
  }
  tl.to({}, { duration: BUFFER }, REVEAL);

  // Title: keep the original reveal timing and speed exactly as-is.
  if (titleWords.length) {
    createEntrance(
      section,
      { start: "top 75%", toggleActions: "play none none reverse", rearm: false },
      (tl) => {
        tl.fromTo(
          titleWords,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: "power3.out",
            duration: 0.6,
            stagger: 0.045,
            immediateRender: true,
          },
          0,
        );
      },
    );
  }

  // The intro's Lottie + text fade-out is owned by createIntroValuesCrossfade so it
  // happens in place (while the panel is still pinned) as Values crossfades in over
  // it, rather than during the panel's upward travel. The dark stage stays opaque.
}

/**
 * Section 4: sticky title + a scrolling list of cards. The left title is revealed
 * by createIntroValuesCrossfade during the 03→04 handoff and then holds (its column
 * is `sticky`). Each card's TEXT reveals as it enters (words stagger up); the card's
 * 16:9 motion is a separate scroll-scrub (createValuesScrub), so the image entrance
 * is the Lottie drawing itself rather than a dissolve. On the way out the text stays
 * put (no reverse) and only re-plays after the card has scrolled fully off the bottom
 * — a separate `top bottom` trigger resets it off-screen so scrolling back up never
 * hides it while it's still visible.
 */
export function createValuesReveal(root: HTMLElement) {
  const section = q(root, "#values");
  if (!section) return;
  const cards = qa(section, "[data-value-card]");
  if (!cards.length) return;

  // The left title is revealed by createIntroValuesCrossfade during the 03→04
  // handoff (not here) — otherwise the -100dvh overlap makes its own trigger fire
  // ~70vh early and double-animate. Cards still reveal on enter below.

  cards.forEach((card, index) => {
    const words = qa(card, "[data-reveal-word]");
    // The FIRST card arrives with the 04 title, so reveal it around mid-viewport
    // (`top 55%`) — not down at the bottom with the rest. Its lead pad (section-values
    // `pt`) is a matched pair with this trigger (pt ≈ trigger% + 40dvh) so the reveal
    // fires just after the title lands. The rest rise from `top 80%` as they scroll in.
    // (Re-arm + settle registration handled by createEntrance.)
    const start = index === 0 ? "top 55%" : "top 80%";
    createEntrance(card, { start }, (tl) => {
      if (words.length) {
        // Text rises word-by-word (the image entrance is the Lottie scrub, not a dissolve).
        tl.fromTo(
          words,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: "power3.out",
            duration: 0.6,
            stagger: 0.045,
            immediateRender: true,
          },
          0,
        );
      }
    });
  });
}

/**
 * Section 4: scroll-scrub each value card's Lottie. The window is `top 75%` → `top 20%`
 * — the motion plays 0→100% while the card rises through the UPPER half of the viewport
 * (where it's prominent), not while it's still entering at the bottom, so the playback
 * actually reads. Frame-bound to scroll, so it reverses when scrolling back up; past the
 * end it holds the last frame. Runs at md+ only — the mobile one-column flow keeps the
 * static webp poster (ValueMotion), and reduced-motion skips it too. The controller
 * arrives async (the Lottie loads after mount), so read it late inside onUpdate — same
 * late-bind as the intro scrub.
 */
export function createValuesScrub(
  root: HTMLElement,
  getController: (index: number) => LottieController | null,
) {
  const section = q(root, "#values");
  if (!section) return;
  const cards = qa(section, "[data-value-card]");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const frame = { t: 0 };
    gsap.to(frame, {
      t: 1,
      ease: "none",
      scrollTrigger: { trigger: card, start: "top 75%", end: "top 20%", scrub: SCRUB },
      onUpdate: () => {
        const l = getController(index);
        if (l?.totalFrames) l.goToAndStop(frame.t * (l.totalFrames - 1), true);
      },
    });
  });
}

/**
 * The 03 Intro → 04 Values handoff, played out ON THE FIXED (pinned) intro stage so
 * the black background never scrolls: 03 (Lottie + copy) fully fades OUT, THEN — with
 * the black held — the 04 dark cover + title fade IN, THEN the right content fades in.
 *
 * Values is pulled up `-140dvh` (section-values `lg:motion-safe:-mt-[140dvh]`) so its
 * sticky title reaches top:0 WHILE #intro is still pinned (dwell ends at "#values top =
 * viewport top"). So the entire fade runs during the pin — only opacity changes, nothing
 * translates — and the card column's lead pad times the first card so its reveal fires
 * just AFTER the title lands (never mid-fade), high in the viewport (see createValuesReveal).
 *
 * Triggers are #values with viewport-relative offsets (no trigger-height% trap), so they
 * re-sync on refresh and don't depend on REGIONS.intro:
 *   1) 03 OUT over [#values top at 40% viewport → #values top at viewport top].
 *   2) 04 cover then title IN over the next 40dvh, ending as the intro pin releases.
 *   3) cards reveal afterward (createValuesReveal); the lead pad times the first card's
 *      (mid-viewport, `top 55%`) reveal to land just after the title.
 *
 * The Lottie + copy share one wrapper (`[data-intro-fade]`), so fading that single
 * element retires them together — the Lottie can't pop out ahead of the text. The
 * Lottie's own entrance fade lives on an inner element, so it never fights this one.
 *
 * Desktop-only (isDesktop matchMedia branch), so cover / title are never gsap-hidden
 * under reduced-motion or no-JS, and the -mt / lead pad are motion-safe-gated to match.
 */
export function createIntroValuesCrossfade(root: HTMLElement) {
  const values = q(root, "#values");
  const intro = q(root, "#intro");
  if (!values || !intro) return;

  const cover = q(values, "[data-values-cover]");
  const titleWords = qa(values, "[data-values-title] [data-reveal-word]");
  // The intro foreground (Lottie + copy) as ONE layer — not the dark stage behind it,
  // so no lower layer shows through before the Values cover has painted over it.
  const introFade = q(intro, "[data-intro-fade]");

  // 1) 03 fully out first, while #intro is still pinned (ends exactly as #values tops out).
  //    Starts at "top 20%" — after createIntroScrub's reveal (ends ~"top top-=10%"), so
  //    the last description line is fully up before 03 begins fading.
  if (introFade) {
    gsap.to(introFade, {
      autoAlpha: 0,
      ease: "none",
      // scrub: true (not SCRUB's ~1.1s catch-up lag) so the fade tracks scroll exactly.
      // A lagged scrub leaves 04 (cover + title) hanging over 03 when scrolling back up
      // — the fade-out trails the scroll, so #values (higher z) ghosts over #intro.
      scrollTrigger: { trigger: values, start: "top 20%", end: "top top", scrub: true },
    });
  }

  // 2) then, with the black still held, the 04 dark cover arrives and the title assembles
  //    — all before the intro pin releases (end "+=40%" == #values top + 40dvh).
  const tl = gsap.timeline({
    // scrub: true (not SCRUB) so the cover/title fade tracks scroll exactly and never
    // lingers over 03 on the way back up (see the 03-out note above).
    scrollTrigger: { trigger: values, start: "top top", end: "+=40%", scrub: true },
  });
  if (cover) {
    gsap.set(cover, { autoAlpha: 0 });
    tl.to(cover, { autoAlpha: 1, ease: "none", duration: 0.5 }, 0);
  }
  if (titleWords.length) {
    gsap.set(titleWords, { yPercent: 110, autoAlpha: 0 });
    tl.to(
      titleWords,
      { yPercent: 0, autoAlpha: 1, ease: "power3.out", stagger: 0.045, duration: 0.5 },
      // Start the title sooner after 03 has fully faded out (was 0.5) so it appears one
      // step faster; still assembles over the dark cover, before the intro pin releases.
      0.3,
    );
  }
}

/** Desktop entrance animations for the non-scrubbed sections. */
export function createDesktopEntrances(root: HTMLElement) {
  // Section 5 (Showcase): the heading reveals word-by-word from behind masks (same as
  // the 04 Values / 06 Blog titles), then the two marquee rows drift up + fade in.
  const showcase = q(root, "#showcase");
  if (showcase) {
    const headingWords = qa(showcase, "[data-showcase-heading] [data-reveal-word]");
    const rows = qa(showcase, "[data-showcase-row]");
    // No reverse: keep the revealed state on scroll-up; createEntrance re-arms it
    // off-screen so it replays on re-entry (same model as Values).
    createEntrance(showcase, { start: "top 75%" }, (tl) => {
      if (headingWords.length) {
        // Words rise from behind their overflow-hidden masks (yPercent 110 -> 0).
        tl.fromTo(
          headingWords,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: "power3.out",
            duration: 0.6,
            stagger: 0.045,
            immediateRender: true,
          },
          0,
        );
      }
      // Rows: drift up + dissolve, cascading in just after the heading.
      rows.forEach((row, index) => {
        tl.fromTo(
          row,
          { autoAlpha: 0, y: 48 },
          { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.8, immediateRender: true },
          index === 0 ? 0.3 : "-=0.65",
        );
      });
    });
    // Continuity into blog: as the blog layer rises to cover showcase, drift the
    // showcase content up and fade it. Both stages share the same dark tone, so this
    // reads as one flowing hand-off (showcase lifts away, blog rises in).
    const content = q(showcase, "[data-showcase-content]");
    if (content) {
      gsap.to(content, {
        yPercent: -20,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: "#blog", start: "top bottom", end: "top top", scrub: SCRUB },
      });
    }
  }
  createBlogReveal(root);
}

/**
 * Section 6: text rises word-by-word from behind `overflow-hidden` masks
 * (`[data-reveal-word]`, yPercent 110 -> 0); thumbnails just drift up + dissolve
 * (`[data-reveal]`, y + opacity — no mask, so the hover-zoom container stays clip-only).
 *
 * Heading and cards enter together at 0 (cards cascade left→right, thumbnail + its title /
 * description within each). Tune CARDS_AT / CARD_STEP below to reshape the pacing. CSS
 * default is visible, so reduced-motion (where this never runs) shows everything.
 */
export function createBlogReveal(root: HTMLElement) {
  const section = q(root, "#blog");
  if (!section) return;
  const words = qa(section, "[data-reveal-word]");
  const images = qa(section, "[data-blog-card] [data-reveal]");
  if (!words.length && !images.length) return;

  // Timeline offsets (seconds). Heading + cards start together at 0. Retune freely.
  const CARDS_AT = 0;
  const CARD_STEP = 0.16;

  // Text rises from behind word masks; images drift up + dissolve (no mask).
  // reverse toggle keeps the original replay model, so no separate re-arm (rearm: false).
  createEntrance(
    section,
    { start: "top 75%", toggleActions: "play none none reverse", rearm: false },
    (tl) => {
      // Explicit from on every tween (no standalone gsap.set): the hidden state is part of the
      // timeline, so any pause(0) / progress(1) renders it exactly instead of replaying from
      // whatever value happened to be captured when a rebuild interrupted it.
      tl.fromTo(
        qa(section, "[data-blog-title] [data-reveal-word]"),
        { yPercent: 110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ...BLOG_REVEAL, stagger: 0.045, immediateRender: true },
        0,
      );
      qa(section, "[data-blog-card]").forEach((card, i) => {
        const at = CARDS_AT + i * CARD_STEP;
        // Thumbnail dissolves up; its title + description words follow at the same beat.
        tl.fromTo(
          qa(card, "[data-reveal]"),
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ...BLOG_REVEAL, immediateRender: true },
          at,
        );
        tl.fromTo(
          qa(card, "[data-reveal-word]"),
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ...BLOG_REVEAL, stagger: 0.04, immediateRender: true },
          at,
        );
      });
    },
  );
}

/**
 * Mobile entrance reveals. Mobile collapses the sticky stack into plain flow, so this
 * ports the desktop word-mask + fade entrances (no pinning, no scrub): text rises
 * word-by-word from behind its masks, images/tiles drift up + dissolve, and each Values
 * card plays its Lottie once as it arrives. Everything plays ONCE on arrival ("top 70%")
 * and re-arms only after the unit has scrolled fully below the viewport, so scrolling
 * back up never re-hides on-screen content (same replay model as the desktop reveals).
 * Runs inside the `!prefersReduced` gate, so reduced-motion keeps the CSS-visible static
 * state. The Bento hero video and the Footer are intentionally left static.
 */
export function createMobileReveals(
  root: HTMLElement,
  getController: (index: number) => LottieController | null,
) {
  const START = "top 70%";

  // A unit plays once on enter, then re-arms (reset to hidden) once it has scrolled fully
  // below the viewport — so it re-plays on the next entry and never re-hides while on screen.
  // createEntrance provides the re-arm + settle registration.
  const revealOnce = (trigger: HTMLElement, build: (tl: gsap.core.Timeline) => void) =>
    createEntrance(trigger, { start: START }, build);

  // Words rise from behind their overflow-hidden masks (yPercent 110 -> 0), same as desktop.
  const maskWords = (tl: gsap.core.Timeline, words: HTMLElement[], at = 0) => {
    if (!words.length) return;
    tl.fromTo(
      words,
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: "power3.out",
        duration: 0.6,
        stagger: 0.045,
        immediateRender: true,
      },
      at,
    );
  };

  // Blocks / images drift up + dissolve.
  const fade = (
    tl: gsap.core.Timeline,
    els: HTMLElement[],
    { y = 32, at = 0, stagger = 0.08 }: { y?: number; at?: number; stagger?: number } = {},
  ) => {
    if (!els.length) return;
    tl.fromTo(
      els,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.6, stagger, immediateRender: true },
      at,
    );
  };

  // 02 Bento: title + description drift in on load; the tile grid reveals when it enters.
  // The hero video is intentionally static (no reveal anchor).
  const bento = q(root, "#bento");
  if (bento) {
    const intro = qa(bento, "[data-bento-mobile-reveal]"); // h1 + description
    if (intro.length) revealOnce(bento, (tl) => fade(tl, intro, { stagger: 0.12 }));
    const grid = q(bento, "[data-bento-mobile-grid]");
    const tiles = qa(bento, "[data-bento-mobile-tile]");
    if (grid && tiles.length) revealOnce(grid, (tl) => fade(tl, tiles, { stagger: 0.1 }));
  }

  // 04 Values: title words, then per card — words rise while the card's Lottie plays once.
  const values = q(root, "#values");
  if (values) {
    const title = q(values, "[data-values-title]");
    const titleWords = qa(values, "[data-values-title] [data-reveal-word]");
    if (title && titleWords.length) revealOnce(title, (tl) => maskWords(tl, titleWords));

    qa(values, "[data-value-card]").forEach((card, index) => {
      const words = qa(card, "[data-reveal-word]");
      createEntrance(
        card,
        {
          start: START,
          // Play the card's Lottie from frame 0 each time the words begin to rise;
          // reset it to frame 0 when the card re-arms off-screen.
          onStart: () => getController(index)?.goToAndPlay(0, true),
          onRearm: () => getController(index)?.goToAndStop(0, true),
        },
        (tl) => maskWords(tl, words),
      );
    });
  }

  // 05 Showcase: heading words, then each marquee row drifts up + dissolves.
  const showcase = q(root, "#showcase");
  if (showcase) {
    const heading = q(showcase, "[data-showcase-heading]");
    const headingWords = qa(showcase, "[data-showcase-heading] [data-reveal-word]");
    if (heading && headingWords.length) revealOnce(heading, (tl) => maskWords(tl, headingWords));
    const rows = qa(showcase, "[data-showcase-row]");
    const rowsContainer = q(showcase, "[data-showcase-rows]");
    if (rowsContainer && rows.length) {
      revealOnce(rowsContainer, (tl) => fade(tl, rows, { y: 48, stagger: 0 }));
    }
  }

  // 06 Blog: heading words, then per card — the thumbnail dissolves up while its words rise.
  const blog = q(root, "#blog");
  if (blog) {
    const title = q(blog, "[data-blog-text]");
    const titleWords = qa(blog, "[data-blog-title] [data-reveal-word]");
    if (title && titleWords.length) revealOnce(title, (tl) => maskWords(tl, titleWords));
    qa(blog, "[data-blog-card]").forEach((card) => {
      const words = qa(card, "[data-reveal-word]");
      const image = qa(card, "[data-reveal]");
      // Touch-only ↗ arrow beside the title. Card words rise at 0.1 with a 0.045 stagger
      // in DOM order (title first, then description), so fade the arrow in over the final
      // title word's window — it lands with the finished title instead of popping in up
      // front. (On fine pointers the arrow is display:none, so this is a harmless no-op.)
      const arrow = qa(card, "[data-blog-arrow]");
      const titleWords = qa(card, "h3 [data-reveal-word]");
      const arrowAt = 0.1 + Math.max(0, titleWords.length - 1) * 0.045;
      revealOnce(card, (tl) => {
        fade(tl, image, { y: 28 });
        maskWords(tl, words, 0.1);
        fade(tl, arrow, { y: 8, at: arrowAt });
      });
    });
  }
}
