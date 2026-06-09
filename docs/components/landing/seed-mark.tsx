/**
 * SEED symbol mark (the standalone glyph from seed-logo.svg, without the wordmark).
 * Uses `currentColor` so the header can recolor it per section.
 */
export function SeedMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 180"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0 97.95H62.8965C67.974 97.95 70.518 104.09 66.927 107.681L32.319 142.289L43.5615 153.531L78.1695 118.923C81.7605 115.332 87.9 117.876 87.9 122.954V180H103.8V106.65C103.8 101.846 107.696 97.95 112.5 97.95H150V82.05H87.1035C82.026 82.05 79.482 75.9105 83.073 72.3195L117.681 37.7115L106.439 26.469L71.8305 61.077C68.2395 64.668 62.1 62.124 62.1 57.0465V0H46.2V73.35C46.2 78.1545 42.3045 82.05 37.5 82.05H0V97.95Z" />
    </svg>
  );
}
