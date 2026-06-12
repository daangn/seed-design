/**
 * Landing page content & shared constants.
 *
 * Centralizes each section's copy, the layout constants (REGIONS / Z), and asset
 * sources. The hero video, bento slots, and intro Lottie point at final assets in
 * `/public/landing`; value / showcase / blog imagery is still placeholder
 * (deterministic picsum) until real content lands.
 */

// --- Responsive / motion media queries (used by gsap.matchMedia) ---
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const MOBILE_QUERY = "(max-width: 1023px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// --- Section dark tone (sections 3 & 4) ---
export const DARK_BG = "#101216";
/** Header background while over dark sections (translucent). */
export const HEADER_TRANSLUCENT_BG = "#1A1C20CC";

/**
 * Sticky scroll-region height per section, in vh. `region - 100` is the "dwell"
 * budget — how long the panel stays pinned (for scrubbed animations) before the
 * next section transitions in. Larger = slower, more deliberate pacing.
 */
export const REGIONS = {
  hero: 160,
  bento: 150,
  intro: 180,
  values: 110,
  showcase: 120,
  blog: 170,
  footer: 150,
} as const;

/**
 * Stacking order for the sticky layers. When a section has a HIGHER z than the
 * one after it, it lifts away to REVEAL the next (e.g. bento→intro, blog→footer).
 * When the next has a higher z, it COVERS the previous (e.g. showcase→values).
 */
export const Z = {
  hero: 10,
  bento: 40,
  intro: 20,
  values: 25,
  showcase: 30,
  blog: 40,
  footer: 10,
} as const;

// --- Header navigation (visual placeholder, links are temporary) ---
export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Foundations", href: "#" },
  { label: "Components", href: "#" },
  { label: "Patterns", href: "#" },
  { label: "Develop", href: "#", hasDropdown: true },
  { label: "AI & Tools", href: "#" },
  { label: "Blog", href: "#" },
];

/** Deterministic picsum placeholder so builds stay stable. */
export const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// --- Section 3: intro copy ---
export const INTRO_TITLE = "당근의 디자인 언어,\nSEED";
export const INTRO_DESCRIPTION =
  "SEED는 당근의 뿌리가 되는 디자인 시스템이에요.\n컴포넌트, 인터랙션, 스타일을 하나의 기준으로 정의해\n더 빠르고 일관된 사용자 경험을 만들어요.";

// --- Section 4: value cards (image 4:3, 432x324) ---
export interface ValueCard {
  title: string;
  description: string;
  image: string;
}

export const VALUE_CARDS: ValueCard[] = [
  {
    title: "Consistent & Essential",
    description:
      "기초가 되는 최소 단위로 단단하게 설계해요\n모든 당근 제품은 같은 뿌리에서 자라나요",
    image: pic("seed-value-consistent", 432, 324),
  },
  {
    title: "Accessible & Clear",
    description:
      "명확한 표현과 예측 가능한 구조로 설계해요\n누구나 동등하게 사용할 수 있는 경험을 만들어요",
    image: pic("seed-value-accessible", 432, 324),
  },
  {
    title: "Responsive & Lively",
    description: "풍부한 표현과 일관된 피드백으로 반응해요\n제품이 살아 숨 쉬는 감각을 만들어요",
    image: pic("seed-value-responsive", 432, 324),
  },
];

// --- Section 5: showcase carousel (16:9 thumbnails) ---
export interface ShowcaseItem {
  title: string;
  image: string;
}

const showcaseItem = (title: string): ShowcaseItem => ({
  title,
  image: pic(`seed-showcase-${title.toLowerCase().replace(/\s+/g, "-")}`, 640, 360),
});

export const SHOWCASE_TITLE = "하나의 시스템, 모든 표면";
export const SHOWCASE_ROW_TOP: ShowcaseItem[] = [
  "Color",
  "Typography",
  "Iconography",
  "State",
  "Radius",
  "Motion",
].map(showcaseItem);

export const SHOWCASE_ROW_BOTTOM: ShowcaseItem[] = [
  "Spacing",
  "Elevation",
  "Layout",
  "Grid",
  "Accessibility",
  "Theme",
].map(showcaseItem);

// --- Section 6: blog (thumbnail 4:3) ---
export interface BlogPost {
  tag: string;
  title: string;
  description: string;
  image: string;
}

export const BLOG_HEADING = "SEED가 자라나는 과정";
export const BLOG_DESCRIPTION =
  "디자인 시스템은 멈춰 있지 않고 계속 자라요.\n당근의 메이커들이 SEED를 발전시키며\n마주한 고민을 꾸준히 들려드려요.";

export const BLOG_POSTS: BlogPost[] = [
  {
    tag: "Branding",
    title: "디자인 시스템에도 브랜드가 필요할까?",
    description: "SEED 리브랜딩을 시작하며",
    image: pic("seed-blog-branding", 432, 324),
  },
  {
    tag: "Design",
    title: "V2에서 V3로",
    description: "당근스러움을 시스템에 담는 법",
    image: pic("seed-blog-v3", 432, 324),
  },
  {
    tag: "Tech",
    title: "AI에게 SEED를 가르치기",
    description: "Cursor + MCP로 디자인 시스템 다루기",
    image: pic("seed-blog-ai", 432, 324),
  },
  {
    tag: "Process",
    title: "토큰부터 컴포넌트까지",
    description: "Rootage 파이프라인 들여다보기",
    image: pic("seed-blog-token", 432, 324),
  },
  {
    tag: "Story",
    title: "메이커들이 말하는 SEED",
    description: "현장에서 쌓인 작은 결정들",
    image: pic("seed-blog-maker", 432, 324),
  },
];

// --- Footer (section 7) ---
export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_MENU: FooterLink[] = [
  { label: "Foundations", href: "#" },
  { label: "Components", href: "#" },
  { label: "Patterns", href: "#" },
  { label: "React", href: "#" },
  { label: "Lynx", href: "#" },
  { label: "AI & Tools", href: "#" },
  { label: "Blog", href: "#" },
];

export const FOOTER_CONTACT: FooterLink[] = [
  { label: "About Daangn", href: "https://about.daangn.com" },
  { label: "Instagram", href: "https://www.instagram.com/daangn" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/daangn" },
];

// --- Lottie placeholders (public sample motions; swap for real assets later) ---
export const LOTTIE = {
  /** Section 3 background motion, scrubbed by scroll. */
  intro: "/landing/intro-parallax.json",
} as const;

/** Bento (section 2) slot assets. */
export const BENTO = {
  mannerVideo: "/landing/bento/manner.mp4",
  seedVideo: "/landing/bento/seed.mp4",
  homeServiceVideo: "/landing/bento/home-service.mp4",
  iconVideo: "/landing/bento/icon.mp4",
  tabLottie: "/landing/bento/tab.json",
  pinLottie: "/landing/bento/pin.json",
} as const;

/** Section 1 hero intro video. */
export const HERO_VIDEO = "/landing/intro.mp4";
