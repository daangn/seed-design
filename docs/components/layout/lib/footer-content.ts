/**
 * 사이트 footer의 콘텐츠/링크 데이터.
 * 문구·링크 변경은 이 파일에서만 한다(프레젠테이션은 ../site-footer.tsx).
 *
 * ponytail: 링크는 안전하게 알려진 목적지로 채운 스타터 값이다. 실제 IA가
 * 정해지면 이 배열만 교체하면 된다.
 */

export interface FooterLink {
  label: string;
  href: string;
  /** 외부 링크면 새 탭 + rel 처리 */
  external?: boolean;
  /** 목적지가 아직 없으면 inert하게 렌더 */
  disabled?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_BRAND = {
  tagline: "Rooted in Daangn.",
  /** "© {year} " 뒤에 붙는다. */
  copyright: "daangn. All rights reserved.",
} as const;

/**
 * footer의 Menu·More·Contact 링크는 랜딩 footer(`components/landing`)와 공유한다 — drift를
 * 막기 위해 여기서만 정의하고 landing-content.ts가 re-export한다(header/nav-items의 NAV_ITEMS
 * 공유 패턴과 동일). Menu 목적지는 헤더 nav(`header/nav-items`의 NAV_ITEMS)와 일치시킨다.
 */
export const FOOTER_MENU: FooterLink[] = [
  { label: "Get Started", href: "/get-started" },
  { label: "Foundations", href: "/foundations" },
  { label: "Components", href: "/components" },
  { label: "Patterns", href: "/patterns" },
  { label: "React", href: "/react" },
  { label: "Lynx", href: "/lynx" },
  { label: "AI & Tools", href: "/ai-integration" },
  { label: "Updates", href: "/updates" },
];

export const FOOTER_MORE: FooterLink[] = [
  { label: "Breeze", href: "/breeze" },
  { label: "Migration", href: "/docs/migration/migration-reference" },
  { label: "Credits", href: "/credits" },
  { label: "GitHub", href: "https://github.com/daangn/seed-design", external: true },
];

export const FOOTER_CONTACT: FooterLink[] = [
  { label: "회사 소개", href: "https://about.daangn.com/", external: true },
  { label: "채용", href: "https://careers.daangn.com/", external: true },
  { label: "Instagram", href: "https://www.instagram.com/daangn", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/daangn", external: true },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Menu", links: FOOTER_MENU },
  { title: "More", links: FOOTER_MORE },
  { title: "Contact", links: FOOTER_CONTACT },
];
