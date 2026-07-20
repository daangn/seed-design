/**
 * SEED symbol mark (the standalone glyph from SEED Logo.svg, without the wordmark).
 * viewBox is cropped to just the mark (source x 0.17–33.5 of the 0 0 119 40 artboard).
 * Uses `currentColor` so the header can recolor it per section.
 */
export function SeedMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 33.667 40"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0.166748 21.7667H14.1437C15.2721 21.7667 15.8374 23.131 15.0394 23.929L7.34875 31.6197L9.82341 34.142L17.5381 26.4273C18.3361 25.6293 19.7004 26.1947 19.7004 27.323V40H23.2337V23.7C23.2337 22.6323 24.0994 21.7667 25.1671 21.7667H33.5004V18.2333H19.5234C18.3951 18.2333 17.8297 16.869 18.6277 16.071L26.3184 8.38033L23.8437 5.858L16.1291 13.5727C15.3311 14.3707 13.9667 13.8053 13.9667 12.677V0H10.4334V16.3C10.4334 17.3677 9.56775 18.2333 8.50008 18.2333H0.166748V21.7667Z" />
    </svg>
  );
}
