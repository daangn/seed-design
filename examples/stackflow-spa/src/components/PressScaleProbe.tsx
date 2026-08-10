import { PRESS_SCALE_CLASS_NAME } from "@seed-design/css/press-scale";
import * as React from "react";

import * as styles from "./PressScalePlayground.css";

// Mirrors packages/qvism-preset/src/utils/press-scale.ts. While
// `--seed-press-scale` is an unregistered custom property its computed value is
// an unevaluated `calc()` chain, so the ratio is re-derived here whenever
// getComputedStyle hands back something unparseable.
const WIDTH_DIVISOR = 4;
const MIN_BASIS = 24;
const PRESS_DEPTH = 2;

const MARKS = ["checkmark", "radiomark", "switchmark"];

interface Reading {
  label: string;
  optedIn: boolean;
  width: number | null;
  height: number | null;
  scale: number | null;
  optedOutMarks: string[];
}

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value);

  return Number.isNaN(parsed) ? null : parsed;
};

/** Trims the trailing zero so a column of sizes stays as narrow as it can. */
const trim = (value: number) => value.toFixed(1).replace(/\.0$/, "");

/**
 * Names the element the way the reader thinks of it: the probe label first, then
 * the recipe slot it renders, and only then the tag — `div` tells nobody which
 * row they are looking at.
 */
function nameOf(element: HTMLElement) {
  if (element.dataset.probe) return element.dataset.probe;

  const slot = [...element.classList].find(
    (name) => name.startsWith("seed-") && name !== PRESS_SCALE_CLASS_NAME && !name.includes("--"),
  );

  if (!slot) return element.tagName.toLowerCase();

  // The section title already names the component, so the slot alone identifies
  // the row — except `root`, which names the component back.
  const [recipe, part] = slot.replace("seed-", "").split("__");

  return part === undefined || part === "root" ? recipe : part;
}

/**
 * A mark's recipe reads `var(--seed-{mark}-press-scale, var(--seed-press-scale))`,
 * so an ancestor that pinned the override wins over the ratio the mark derived
 * for itself. Reporting the raw ratio here would claim a shrink that a mark
 * inside a ListItem never performs.
 */
function overrideFor(element: HTMLElement, style: CSSStyleDeclaration) {
  const mark = MARKS.find((name) => element.classList.contains(`seed-${name}__root`));
  if (!mark) return null;

  return toNumber(style.getPropertyValue(`--seed-${mark}-press-scale`));
}

function read(element: HTMLElement): Reading {
  const style = getComputedStyle(element);
  const width = toNumber(style.getPropertyValue("--seed-element-width"));
  const height = toNumber(style.getPropertyValue("--seed-element-height"));

  const basis =
    width === null || height === null ? null : Math.max(height, width / WIDTH_DIVISOR, MIN_BASIS);

  const derived =
    toNumber(style.getPropertyValue("--seed-press-scale")) ??
    (basis === null ? null : (basis - PRESS_DEPTH) / basis);

  return {
    label: nameOf(element),
    optedIn: element.classList.contains(PRESS_SCALE_CLASS_NAME),
    width,
    height,
    scale: overrideFor(element, style) ?? derived,
    optedOutMarks: MARKS.filter(
      (mark) => style.getPropertyValue(`--seed-${mark}-press-scale`).trim() === "1",
    ),
  };
}

function Row({ reading }: { reading: Reading }) {
  const { label, optedIn, width, height, scale } = reading;
  const measured = width !== null && height !== null;

  if (!optedIn || !measured || scale === null) {
    return (
      <div className={styles.dataRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.note}>{!measured ? "크기 미발행" : "클래스 없음"} → 배율 1</span>
      </div>
    );
  }

  return (
    <div className={styles.dataRow}>
      <span className={styles.label}>{label}</span>
      <span className={styles.numeric}>{`${trim(width)}×${trim(height)}`}</span>
      <span className={styles.numeric}>{scale.toFixed(4)}</span>
      <span className={scale === 1 ? styles.inert : styles.shrink}>
        {(height * (1 - scale)).toFixed(1)}
      </span>
      <span className={scale === 1 ? styles.inert : styles.shrink}>
        {(width * (1 - scale)).toFixed(1)}
      </span>
    </div>
  );
}

/**
 * Reads back what the press scale published on every opted-in element below it:
 * the measured size, the ratio derived from it, and whether an ancestor turned a
 * nested mark's scale off. Reads only — nothing here feeds back into styles.
 *
 * An element qualifies when it carries the opt-in class, the size vars, or a
 * `data-probe` label, so an element wired up with only one half of
 * `usePressScale` still shows up in the list — the size vars land a frame later
 * than this collection, which would otherwise miss the ref-without-class case.
 */
export function PressScaleProbe({
  children,
  tone = "default",
  flush = false,
  only,
}: {
  children: React.ReactNode;
  tone?: keyof typeof styles.panelTone;
  flush?: boolean;
  /**
   * Narrows the readout to the elements a section is actually about. A slot can
   * publish its size without ever scaling — a Callout root gates the scale on
   * `:is(button, a)` — and listing it beside the close button reads as a
   * measurement that contradicts the section.
   */
  only?: string;
}) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [readings, setReadings] = React.useState<Reading[]>([]);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const targets = [...stage.querySelectorAll<HTMLElement>("*")].filter(
      (element) =>
        (only === undefined || element.matches(only)) &&
        (element.classList.contains(PRESS_SCALE_CLASS_NAME) ||
          element.style.getPropertyValue("--seed-element-width") !== "" ||
          element.dataset.probe !== undefined),
    );

    let frame = 0;
    // Runs after the observer inside `useElementSizeVars`, which was created
    // first, so the size vars are already on the element when this reads them.
    const observer = new ResizeObserver(() => {
      frame = requestAnimationFrame(() => setReadings(targets.map(read)));
    });

    for (const target of targets) observer.observe(target);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [only]);

  const optedOutMarks = [...new Set(readings.flatMap((reading) => reading.optedOutMarks))];

  return (
    <div className={`${styles.panel} ${styles.panelTone[tone]}`}>
      <div className={flush ? styles.stageFlush : styles.stage} ref={stageRef}>
        {children}
      </div>
      <div className={styles.readout}>
        <div className={styles.headRow}>
          <span>요소</span>
          <span className={styles.numeric}>크기</span>
          <span className={styles.numeric}>배율</span>
          <span className={styles.numeric}>세로</span>
          <span className={styles.numeric}>가로</span>
        </div>
        {readings.map((reading, index) => (
          <Row key={`${reading.label}-${index}`} reading={reading} />
        ))}
        {optedOutMarks.length > 0 && (
          <p className={styles.markOptOutNote}>마크 축소 꺼짐 — {optedOutMarks.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
