"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "./lib/landing-content";

type Mode = "dot" | "expand" | "text";

/** SEED identity dot → expanded ring. Blog cards morph it into a titled capsule. */
const CURSOR_COLORS = ["#07543A", "#CCFFA3", "#262626", "#FF6600"];
const FALLBACK_COLOR = "#212121";
const INTERACTIVE = "[data-cursor], a, button";

/**
 * Custom cursor: a small dot (the SEED "Rooted in Daangn." mark) that expands over
 * clickable elements and, over blog cards, becomes a pill showing the post title on
 * a random brand color. The color is locked while hovering one card (moving inside
 * it doesn't reshuffle) and only re-randomizes when you leave and enter again.
 * Desktop + fine-pointer + motion only; otherwise the native cursor stays.
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
  const [bg, setBg] = useState(CURSOR_COLORS[0] ?? FALLBACK_COLOR);

  // Position tracking + hover detection (mount once).
  useGSAP(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!desktop || reduced || !finePointer) return;

    const el = dotRef.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target;
      const hit = target instanceof Element ? target.closest<HTMLElement>(INTERACTIVE) : null;
      if (!hit) {
        hovered.current = null;
        setMode("dot");
        return;
      }
      // Same card (e.g. moving over its children) — keep the current look.
      if (hit === hovered.current) return;
      hovered.current = hit;
      if (hit.dataset.cursor === "text") {
        setText(hit.dataset.cursorText ?? "");
        setBg(CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)] ?? FALLBACK_COLOR);
        setMode("text");
      } else {
        setMode("expand");
      }
    };
    const onOut = (e: PointerEvent) => {
      const related = e.relatedTarget;
      const stillInside = related instanceof Element && related.closest(INTERACTIVE);
      if (!stillInside) {
        hovered.current = null;
        setMode("dot");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.documentElement.classList.add("cursor-hidden");
    return () => {
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
      gsap.set(el, { width: "auto" });
      gsap.to(el, { height: 40, duration: 0.28, ease: "power3.out" });
    } else {
      const size = mode === "dot" ? 12 : 52;
      gsap.to(el, { width: size, height: size, duration: 0.28, ease: "power3.out" });
    }
  }, [mode]);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden items-center justify-center whitespace-nowrap rounded-full will-change-transform [@media(pointer:fine)]:flex"
      style={{
        backgroundColor: mode === "text" ? bg : "#ffffff",
        // difference keeps the dot/ring visible on any background; the titled pill
        // shows its real brand color.
        mixBlendMode: mode === "text" ? "normal" : "difference",
      }}
    >
      {mode === "text" && <span className="px-4 font-bold text-sm text-white">{text}</span>}
    </div>
  );
}
