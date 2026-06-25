import type { ReactNode } from "react";

/*
  문서용 인라인 배지. SEED Badge는 max-width로 긴 라벨을 truncate해서
  "타입 에러로 발견 가능" 같은 라벨에 맞지 않으므로, SEED 색 토큰만 재사용한
  커스텀 pill로 둔다. mdx-components에서 `Badge` 이름으로 전역 등록한다.
*/
const TONES = {
  neutral: { bg: "--seed-color-bg-neutral-weak", fg: "--seed-color-fg-neutral" },
  warning: { bg: "--seed-color-bg-warning-weak", fg: "--seed-color-fg-warning" },
  informative: { bg: "--seed-color-bg-informative-weak", fg: "--seed-color-fg-informative" },
  positive: { bg: "--seed-color-bg-positive-weak", fg: "--seed-color-fg-positive" },
  critical: { bg: "--seed-color-bg-critical-weak", fg: "--seed-color-fg-critical" },
  brand: { bg: "--seed-color-bg-brand-weak", fg: "--seed-color-fg-brand" },
} as const satisfies Record<string, { bg: string; fg: string }>;

interface BadgeProps {
  tone?: keyof typeof TONES;
  children: ReactNode;
}

export function Badge({ tone = "neutral", children }: BadgeProps) {
  // MDX 호출부는 타입 체크되지 않으므로, 등록되지 않은 tone 문자열이 와도 크래시하지 않게 fallback한다.
  const { bg, fg } = TONES[tone] ?? TONES.neutral;

  return (
    <span
      className="not-prose inline-flex items-center rounded-lg px-3 py-1 text-sm font-semibold align-middle"
      style={{ backgroundColor: `var(${bg})`, color: `var(${fg})` }}
    >
      {children}
    </span>
  );
}
