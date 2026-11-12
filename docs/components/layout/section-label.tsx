// 최상위 IA(8개, 헤더 nav `components/header/nav-items.ts`와 같은 섹션)라 사실상 drift가 없어 로컬 맵으로 둔다.
// 섹션이 바뀌면 여기와 nav-items.ts를 함께 손본다.
const SECTIONS: { prefix: string; label: string }[] = [
  { prefix: "/get-started", label: "Get Started" },
  { prefix: "/foundations", label: "Foundations" },
  { prefix: "/components", label: "Components" },
  { prefix: "/patterns", label: "Patterns" },
  { prefix: "/react", label: "React" },
  { prefix: "/lynx", label: "Lynx" },
  { prefix: "/ai-integration", label: "AI & Tools" },
  { prefix: "/updates", label: "Updates" },
];

/**
 * 상세 페이지 최상단에 현재 섹션명을 작게 표기(t4-regular). 빌드 때 정적으로 그린다.
 * 섹션 매칭은 pathname prefix로 — prefix끼리 중첩되지 않아 단순 일치/하위경로 검사로 충분하다. 섹션 밖이면 null.
 */
export function SectionLabel({ pathname }: { pathname: string }) {
  const section = SECTIONS.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!section) return null;

  return <span className="t4-regular text-fg-neutral-muted">{section.label}</span>;
}
