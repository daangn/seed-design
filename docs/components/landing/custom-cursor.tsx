"use client";

import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { useRef, useState } from "react";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { DESKTOP_QUERY } from "./lib/landing-content";

type Mode = "dot" | "expand" | "text";

/** SEED identity dot → expanded ring. Blog cards morph it into a titled capsule.
 *  Each capsule picks a bg/fg pair so the label keeps contrast on any brand color. */
const CURSOR_COLORS = [
  { bg: "#FF6600", fg: "#000000" }, // Orange
  { bg: "#1A1C20", fg: "#FFFFFF" }, // Gray-1000 → inverted
  { bg: "#CCFFA3", fg: "#000000" }, // Lime
];
const FALLBACK_COLOR = { bg: "#212121", fg: "#ffffff" };
const INTERACTIVE = "[data-cursor], a, button";

/**
 * Custom cursor: a small dot (the SEED "Rooted in Daangn." mark) that expands over
 * clickable elements and, over blog cards, becomes a pill showing the post title on
 * a random brand color. The color is locked while hovering one card (moving inside
 * it doesn't reshuffle) and only re-randomizes when you leave and enter again.
 * LandingExperience mounts this only on desktop when motion is allowed. This component
 * additionally checks for a fine pointer; otherwise the native cursor stays.
 *
 * Position is driven with GSAP `quickTo` (no re-render on move); only mode / text /
 * color use state, and only change on hover enter/leave of a new target.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  // The element currently hovered — used to keep the color fixed while moving
  // within the same card and only reshuffle on a genuinely new target.
  const hovered = useRef<Element | null>(null);
  const [mode, setMode] = useState<Mode>("dot");
  const [text, setText] = useState("");
  const [pill, setPill] = useState(CURSOR_COLORS[0] ?? FALLBACK_COLOR);
  // Arrow direction inside the "더보기" pill: right (→) for internal targets,
  // up-right (↗) for external. Driven per-element via `data-cursor-arrow` so the
  // same pill can point differently on the (internal) showcase vs (external) blog.
  const [arrow, setArrow] = useState<"right" | "up-right">("right");

  // Position tracking + hover detection (mount once).
  useGSAP(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!desktop || !finePointer) return;

    const el = dotRef.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.12, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    // Returning to the dot is deferred briefly so flicking across the gaps between
    // blog cards doesn't collapse the pill to a dot and back on every crossing.
    const DOT_DELAY = 90;
    let dotTimer = 0;
    const cancelDotReturn = () => {
      if (dotTimer) {
        clearTimeout(dotTimer);
        dotTimer = 0;
      }
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target;
      const hit = target instanceof Element ? target.closest<HTMLElement>(INTERACTIVE) : null;
      if (!hit) return; // gaps are handled by onOut's deferred return
      cancelDotReturn();
      // Same card (e.g. moving over its children) — keep the current look.
      if (hit === hovered.current) return;
      hovered.current = hit;
      if (hit.dataset.cursor === "text") {
        setText(hit.dataset.cursorText ?? "");
        setPill(CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)] ?? FALLBACK_COLOR);
        setArrow(hit.dataset.cursorArrow === "up-right" ? "up-right" : "right");
        setMode("text");
      } else {
        setMode("expand");
      }
    };
    const onOut = (e: PointerEvent) => {
      const related = e.relatedTarget;
      const stillInside = related instanceof Element && related.closest(INTERACTIVE);
      if (stillInside) return;
      cancelDotReturn();
      dotTimer = window.setTimeout(() => {
        hovered.current = null;
        setMode("dot");
        dotTimer = 0;
      }, DOT_DELAY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.documentElement.classList.add("cursor-hidden");
    return () => {
      cancelDotReturn();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, []);

  // Size morph on mode change (low frequency). dot/expand are circles; text is a
  // pill that hugs its label (auto width) at a small fixed height.
  useGSAP(() => {
    const el = dotRef.current;
    if (!el) return;
    if (mode === "text") {
      // Tween width to a measured px target — animating to "auto" is unstable and
      // makes the pill jitter/shrink when flicking quickly between cards.
      const fromW = Number(gsap.getProperty(el, "width")) || 0;
      gsap.set(el, { width: "auto" });
      const toW = el.offsetWidth;
      gsap.set(el, { width: fromW });
      gsap.to(el, { width: toW, height: 40, duration: 0.36, ease: "power3.out" });
    } else {
      const size = mode === "dot" ? 12 : 26;
      gsap.to(el, { width: size, height: size, duration: 0.36, ease: "power3.out" });
    }
  }, [mode, text]);

  return (
    // z above SEED's portaled nav menu (99999) so the cursor stays visible over open dropdowns
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100000] hidden items-center justify-center whitespace-nowrap rounded-full will-change-transform [@media(pointer:fine)]:flex"
      style={{
        backgroundColor: mode === "text" ? pill.bg : "#ffffff",
        // difference keeps the dot/ring visible on any background; the titled pill
        // shows its real brand color.
        mixBlendMode: mode === "text" ? "normal" : "difference",
      }}
    >
      {mode === "text" && (
        <span
          className="flex items-center gap-1 pr-3 pl-4 font-bold text-xl"
          style={{ color: pill.fg }}
        >
          <span className="text-[16px]">{text}</span>
          {/* Filled arrow glyph; fill follows the pill's text color (currentColor).
              Arrow stays at the 04 Values body size (desktop 20px); the "더보기"
              label is intentionally smaller at 16px. Rotated -45° for external
              targets so the → glyph reads as ↗. */}
          <IconSeedArrow
            external={arrow === "up-right"}
            className={clsx(
              "size-5 transition-transform",
              arrow === "up-right" && "-translate-y-[1px]",
            )}
          />
        </span>
      )}
    </div>
  );
}
