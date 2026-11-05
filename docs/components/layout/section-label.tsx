"use client";

import { usePathname } from "next/navigation";

// ponytail: 최상위 IA(8개, layout.config.tsx의 sidebar.tabs를 미러)라 사실상 drift 없음 →
// 무거운 layout.config(아이콘·JSX 포함)에 결합하지 않고 로컬 맵으로 둔다.
// 섹션이 바뀌면 여기와 sidebar.tabs 둘 다 손보면 된다.
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
 * 상세 페이지 최상단에 현재 섹션명을 작게 표기(t4-regular). 섹션 매칭은 pathname prefix로 —
 * prefix끼리 중첩되지 않아 단순 일치/하위경로 검사로 충분하다. 섹션 밖이면 null.
 */
export function SectionLabel() {
  const pathname = usePathname();
  const section = SECTIONS.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!section) return null;

  return <span className="t4-regular text-fg-neutral-muted">{section.label}</span>;
}
