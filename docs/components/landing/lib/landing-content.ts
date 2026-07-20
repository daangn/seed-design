/**
 * Landing page content & shared constants.
 *
 * Centralizes each section's copy, the layout constants (REGIONS / Z), and asset
 * sources. The hero video, bento slots, intro Lottie, and section imagery all point
 * at final assets in `/public/landing`.
 */

// --- Responsive / motion media queries (used by gsap.matchMedia) ---
// The landing has TWO responsive axes:
//  - md (768): the wide body-layout boundary. Tablet uses Hero + desktop Bento/Values,
//    while mobile keeps the compact one-column Bento. WIDE_LAYOUT_QUERY / MOBILE_QUERY.
//  - lg (1024): the full desktop mode + 03 Intro/pinned-choreography boundary.
//    DESKTOP_QUERY / INTRO_QUERY. Keep these in lockstep with
//    the `lg:` prefixes on Values choreography and the JS-selected Intro tree.
export const WIDE_LAYOUT_QUERY = "(min-width: 768px)";
export const MOBILE_QUERY = "(max-width: 767.98px)";
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const INTRO_QUERY = DESKTOP_QUERY;

// --- Section dark tone (sections 3 & 4) ---
// JS 소비처(inline style / body write)는 이 상수를 쓴다. Tailwind는 JS 상수를 못 받으므로
// section-bento/showcase/blog의 `bg-[#121212]`는 리터럴 — 값 변경 시 그 셋도 함께 고친다.
export const DARK_BG = "#121212";

/**
 * Sticky scroll-region height per section, in vh. `region - 100` is the "dwell"
 * budget — how long the panel stays pinned (for scrubbed animations) before the
 * next section transitions in. Larger = slower, more deliberate pacing.
 *
 * Note: don't enlarge these to make scroll feel slower — it adds dead pinned
 * space (esp. on the non-scrubbed sections) that reads as "stuck". To slow
 * scrolling evenly, lower Lenis `wheelMultiplier` in landing-experience.tsx.
 */
export const REGIONS = {
  hero: 110,
  // 100 = bento fills the full viewport on desktop (mobileStack → only applies
  // from lg; compact mode keeps its natural-height stack). Not pinned, so no
  // dead pinned space.
  bento: 100,
  // 260 = a ~140dvh pinned dwell for the reveal + a HOLD after it: the intro reveal
  // (Lottie zoom + copy) finishes in the first ~80dvh, then the fully-revealed screen
  // holds for ~30dvh of scroll before the 03→04 fade begins (see createIntroScrub /
  // createIntroValuesCrossfade). Raise this to lengthen the hold; the fade + 04 title-in
  // are anchored to #values (pulled up -140dvh) so they stay put relative to the pin end.
  intro: 260,
  // Values uses `growToContent` (sticky title + scrolling card list), so its
  // height comes from content and this value is unused — kept for prop shape.
  values: 100,
  showcase: 100,
  blog: 100,
} as const;

/**
 * Stacking order for the sticky layers. When a section has a HIGHER z than the
 * one after it, it lifts away to REVEAL the next (e.g. bento→intro). When the next
 * has a higher z, it COVERS the previous (e.g. showcase→values). The footer is a
 * fixed bottom layer outside this stack (see section-footer).
 */
export const Z = {
  hero: 10,
  bento: 40,
  intro: 20,
  values: 25,
  showcase: 30,
  blog: 40,
} as const;

// --- Header navigation ---
// Moved to the shared header module so the docs header and landing header share
// one nav source. Re-exported here for backward-compatible imports.
export type { NavItem } from "../../header/nav-items";
export { NAV_ITEMS } from "../../header/nav-items";

// --- Section 3: intro copy ---
export const INTRO_TITLE = "당근의 디자인 시스템\nSEED";
export const INTRO_DESCRIPTION =
  "SEED는 당근의 뿌리가 되는 디자인 시스템이에요.\n컴포넌트, 인터랙션, 스타일을 하나의 기준으로 정의해\n더 빠르고 일관된 사용자 경험을 만들 수 있게 해요.";

// --- Section 4: values (fixed title + scroll slideshow of principle cards) ---
export const VALUES_TITLE = "SEED의\n디자인 원칙";

// Value motion is 16:9 (matches the source Lottie comp). `image` is the static
// .webp shown under reduced-motion / no-JS; `lottie` is the scroll-scrubbed
// motion (createValuesScrub). Mapping follows the design mockup: Consistent =
// orange, Accessible = green, Responsive = dark/lines.
export interface ValueCard {
  title: string;
  description: string;
  image: string;
  lottie: string;
}

export const VALUE_CARDS: ValueCard[] = [
  {
    title: "Consistent & Essential",
    description:
      "기초가 되는 최소 단위로 단단하게 설계해요\n모든 당근 제품은 같은 뿌리에서 자라나요",
    image: "/landing/values/consistent.webp",
    lottie: "/landing/values/consistent.json",
  },
  {
    title: "Accessible & Clear",
    description:
      "명확한 표현과 예측 가능한 구조로 설계해요\n누구나 동등하게 사용할 수 있는 경험을 만들어요",
    image: "/landing/values/accessible.webp",
    lottie: "/landing/values/accessible.json",
  },
  {
    title: "Responsive & Lively",
    description: "풍부한 표현과 일관된 피드백으로 반응해요\n제품이 살아 숨 쉬는 감각을 만들어요",
    image: "/landing/values/responsive.webp",
    lottie: "/landing/values/responsive.json",
  },
];

// --- Section 5: showcase carousel (16:9 thumbnails) ---
export interface ShowcaseItem {
  title: string;
  image: string;
  href: string;
}

export const SHOWCASE_TITLE = "SEED의 기반";
export const SHOWCASE_ROW_TOP: ShowcaseItem[] = [
  {
    title: "Layout",
    image: "/landing/showcase/layout.webp",
    href: "/foundations/layout",
  },
  {
    title: "Voice and Tone",
    image: "/landing/showcase/voice-and-tone.webp",
    href: "/foundations/voice-and-tone",
  },
  {
    title: "Color",
    image: "/landing/showcase/color.webp",
    href: "/foundations/color/color-system",
  },
  {
    title: "Iconography",
    image: "/landing/showcase/iconography.webp",
    href: "/foundations/iconography",
  },
  {
    title: "Elevation",
    image: "/landing/showcase/elevation.webp",
    href: "/foundations/elevation",
  },
  {
    title: "Gradient",
    image: "/landing/showcase/gradient.webp",
    href: "/foundations/gradient",
  },
  {
    title: "Design Token",
    image: "/landing/showcase/design-token.webp",
    href: "/foundations/design-token",
  },
];

export const SHOWCASE_ROW_BOTTOM: ShowcaseItem[] = [
  {
    title: "Writing",
    image: "/landing/showcase/writing.webp",
    href: "/foundations/writing",
  },
  {
    title: "Radius",
    image: "/landing/showcase/radius.webp",
    href: "/foundations/radius",
  },
  {
    title: "Spacing",
    image: "/landing/showcase/spacing.webp",
    href: "/foundations/spacing",
  },
  {
    title: "State",
    image: "/landing/showcase/state.webp",
    href: "/foundations/state",
  },
  {
    title: "Motion",
    image: "/landing/showcase/motion.webp",
    href: "/foundations/motion",
  },
  {
    title: "International Design",
    image: "/landing/showcase/international-design.webp",
    href: "/foundations/international-design",
  },
  {
    title: "Inclusive Design",
    image: "/landing/showcase/inclusive-design.webp",
    href: "/foundations/inclusive-design",
  },
  {
    title: "Typography",
    image: "/landing/showcase/typography.webp",
    href: "/foundations/typography",
  },
];

// --- Section 6: blog (thumbnail 16:9) ---
// 카드는 팀블로그 원문으로 나가는 외부 링크다. 제목은 랜딩에서 통일한 표기를 쓴다(실제 글 제목과 다를 수 있음).
export interface BlogPost {
  title: string;
  description: string;
  image: string;
  /** 내부 글이면 `/updates/<slug>`, 외부 팀블로그면 원문 URL. */
  href: string;
  /** true=외부 팀블로그 원문(↗, 새 탭). false=내부 /updates 글(→, 같은 탭). */
  external: boolean;
  /** 게시일(ISO). /updates 카드의 날짜 표시·정렬에 쓰인다. 내부 글은 MDX frontmatter가 대신하므로 외부 글에만 지정한다. */
  publishedAt?: string;
}

export const BLOG_HEADING = "SEED가 자라나는 과정";

// 랜딩 06 Blog와 /updates 카드가 공유하는 단일 소스라 한 곳만 고치면 양쪽에 반영된다.
// 1·2번은 내부 /updates 글(→), 3번만 외부 팀블로그(↗). slug를 바꾸면 href도 함께 고친다.
export const BLOG_POSTS: BlogPost[] = [
  {
    title: "디자인 시스템에도 브랜드가 필요할까?",
    description: "SEED 리브랜딩을 시작한 이유",
    image: "/landing/blog/branding.webp",
    href: "/updates/why-design-system-needs-branding",
    external: false,
  },
  {
    title: "더 당근답게 : SEED는 어떻게 진화했나",
    description: "'당근스러움'을 시스템에 담는 법",
    image: "/landing/blog/v2-to-v3.webp",
    href: "/updates/how-seed-evolved",
    external: false,
  },
  {
    title: "디자인 시스템 팀은 디자인 시스템만 잘 만들면 될까",
    description: "디자인 시스템이 AI 시대에 나아가야 하는 방향",
    image: "/landing/blog/ai-direction.webp",
    href: "https://medium.com/daangn/%EB%94%94%EC%9E%90%EC%9D%B8%EC%8B%9C%EC%8A%A4%ED%85%9C-%ED%8C%80%EC%9D%80-%EB%94%94%EC%9E%90%EC%9D%B8%EC%8B%9C%EC%8A%A4%ED%85%9C%EB%A7%8C-%EC%9E%98-%EB%A7%8C%EB%93%A4%EB%A9%B4-%EB%90%A0%EA%B9%8C-4f6f2478a8db",
    external: true,
    publishedAt: "2026-06-11T00:00:00+09:00",
  },
];

// --- Footer (section 7) ---
// Menu·More·Contact 링크는 사이트 footer와 동일해야 하므로 layout의 단일 정의를 re-export한다
// (위 NAV_ITEMS 공유와 동일 패턴). 랜딩 footer가 사이트 footer와 같은 내용을 렌더한다.
export {
  type FooterLink,
  FOOTER_MENU,
  FOOTER_CONTACT,
  FOOTER_MORE,
} from "../../layout/lib/footer-content";

// --- Lottie placeholders (public sample motions; swap for real assets later) ---
export const LOTTIE = {
  /** Section 3 background motion, scrubbed by scroll. */
  intro: "/landing/intro-parallax.json",
} as const;

/**
 * A video asset at multiple sizes plus a poster frame. The renderer picks a
 * `<source>` by viewport; `mid` is optional (some clips ship only high/low).
 */
export interface VideoSet {
  high: string;
  mid?: string;
  low: string;
  poster: string;
}

/** Bento (section 2) slot assets. Videos are multi-tier; lotties are single json. */
export const BENTO = {
  manner: {
    high: "/landing/bento/manner/high.mp4",
    mid: "/landing/bento/manner/mid.mp4",
    low: "/landing/bento/manner/low.mp4",
    poster: "/landing/bento/manner/poster.webp",
  },
  homeService: {
    high: "/landing/bento/home-service/high.mp4",
    low: "/landing/bento/home-service/low.mp4",
    poster: "/landing/bento/home-service/poster.webp",
  },
  icon: {
    high: "/landing/bento/icon/high.mp4",
    mid: "/landing/bento/icon/mid.mp4",
    low: "/landing/bento/icon/low.mp4",
    poster: "/landing/bento/icon/poster.webp",
  },
  tabLottie: "/landing/bento/tab.json",
  pinLottie: "/landing/bento/pin.json",
  seedLottie: "/landing/bento/seed.json",
} as const;

/** Section 1 hero intro video. */
export const HERO_VIDEO = "/landing/intro.mp4";
export const HERO_POSTER = "/landing/intro-poster.webp";

// --- Mobile (< lg) ---
// On mobile, sections 01/02/03 collapse into one flowing block rendered by
// SectionBento: a portrait intro video, then the design-language copy, then a
// 3-tile bento. The hero (01) and dark Lottie intro (03) are hidden on mobile.

/** Mobile hero intro video (portrait 4:5; desktop uses the 16:9 HERO_VIDEO). */
export const HERO_VIDEO_MOBILE = "/landing/intro-mobile.mp4";
export const HERO_POSTER_MOBILE = "/landing/intro-mobile-poster.webp";

// Mobile intro copy — title is shared with desktop INTRO_TITLE, but the
// description is a mobile-only string: the desktop \n line breaks are
// flattened into a single flowing sentence (the p wraps naturally), and the
// trailing words are NBSP-joined so "해요." never orphans onto its own line.
export const BENTO_MOBILE_TITLE = INTRO_TITLE;
export const BENTO_MOBILE_DESCRIPTION =
  "SEED는 당근의 뿌리가 되는 디자인 시스템이에요. 컴포넌트, 인터랙션, 스타일을 하나의 기준으로 정의해 더 빠르고 일관된 사용자 경험을 만들 수 있게 해요.";

/** Mobile bento (3 tiles): icon video, pin Lottie, manner video. */
export const BENTO_MOBILE = {
  icon: {
    src: "/landing/bento/icon/mobile.mp4",
    poster: "/landing/bento/icon/mobile-poster.webp",
  },
  pinLottie: "/landing/bento/pin-mobile.json",
  manner: {
    src: "/landing/bento/manner/mobile.mp4",
    poster: "/landing/bento/manner/mobile-poster.webp",
  },
} as const;
