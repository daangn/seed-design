import { vars } from "@seed-design/lynx-css/vars";

import "../styles/nested-vars-test.css";

/**
 * Lynx 3.6+ Nested CSS Variables 테스트 페이지
 *
 * 검증 항목:
 * A. CSS 파일에서 nested var() — page 토큰 중첩 참조가 런타임에 resolve되는지
 * B. inline style object — 객체 형태로 CSS variable 설정이 동작하는지
 * C. semantic token 직접 값 — 비교 기준
 */

function SectionTitle({ children }: { children: string }) {
  return <text className="t5-bold mt-x4 mb-x2 text-fg-neutral">{children}</text>;
}

function TestResult({
  label,
  expected,
  children,
}: {
  label: string;
  expected: string;
  children: React.ReactNode;
}) {
  return (
    <view className="p-x2 mb-x1_5 border-b border-stroke-neutral-muted">
      <text className="t3-regular text-fg-neutral-subtle mb-x1">
        {label} (기대: {expected})
      </text>
      {children}
    </view>
  );
}

export function NestedVarsTestPage() {
  return (
    <scroll-view scroll-y className="flex flex-col gap-x2 flex-1">
      <text className="t7-bold text-fg-neutral">Nested CSS Variables Test</text>
      <text className="t3-regular text-fg-neutral-subtle">Lynx 3.6+ nested var() 지원 검증</text>

      {/* ── 테스트 A: CSS 파일의 nested var() ── */}
      <SectionTitle>A. CSS nested var() (클래스 기반)</SectionTitle>

      <TestResult
        label="1단계 중첩: --test-fg-brand = var(--seed-color-fg-brand)"
        expected="fg.brand 색상"
      >
        <text className="nested-test-brand">이 텍스트가 주황색이면 1단계 nested var() 동작</text>
      </TestResult>

      <TestResult
        label="1단계 중첩: --test-fg-critical = var(--seed-color-fg-critical)"
        expected="fg.critical 색상"
      >
        <text className="nested-test-critical">이 텍스트가 빨간색이면 1단계 nested var() 동작</text>
      </TestResult>

      <TestResult
        label="2단계 중첩: --test-heading-size = calc(var(--test-font-size) * 1.5)"
        expected="큰 폰트"
      >
        <text className="nested-test-heading">
          이 텍스트가 크고 주황색이면 2단계 nested var() 동작
        </text>
      </TestResult>

      <TestResult
        label="calc() 내 var(): --test-spacing-lg = calc(var(--test-spacing-base) * 2)"
        expected="16px padding"
      >
        <view className="bg-bg-neutral-weak rounded-r1">
          <text className="nested-test-brand">
            이 텍스트 주변에 16px padding이 있으면 calc(var()) 동작
          </text>
        </view>
      </TestResult>

      {/* ── 테스트 B: style 객체로 CSS variable 설정 ── */}
      <SectionTitle>B. inline style object 객체 형태</SectionTitle>

      <TestResult
        label="inline object --test-inline-color: fg.informative"
        expected="informative 텍스트"
      >
        <view
          style={
            { "--test-inline-color": "var(--seed-color-fg-informative)" } as Record<string, string>
          }
        >
          <text style={{ color: "var(--test-inline-color)" }}>
            이 텍스트가 파란색이면 style 객체로 CSS var 설정 동작
          </text>
        </view>
      </TestResult>

      <TestResult label="inline object --size: 20px + font-size: var(--size)" expected="20px 폰트">
        <view style={{ "--test-inline-size": "20px" } as Record<string, string>}>
          <text className="text-fg-neutral" style={{ fontSize: "var(--test-inline-size)" }}>
            이 텍스트가 20px이면 style 객체 var() 참조 동작
          </text>
        </view>
      </TestResult>

      <TestResult
        label="CSS var 상속: 부모에서 fg.positive 설정 → 자식에서 사용"
        expected="positive 텍스트"
      >
        <view
          style={{ "--test-inherited": "var(--seed-color-fg-positive)" } as Record<string, string>}
        >
          <view>
            <text style={{ color: "var(--test-inherited)" }}>
              이 텍스트가 녹색이면 CSS var 상속 동작
            </text>
          </view>
        </view>
      </TestResult>

      {/* ── 테스트 C: semantic token 직접 값 (비교 기준) ── */}
      <SectionTitle>C. semantic token 직접 값 (비교 기준)</SectionTitle>

      <TestResult label="color: fg.brand 직접 지정" expected="fg.brand">
        <text style={{ color: vars.$color.fg.brand, fontSize: "14px" }}>
          fg.brand 텍스트 (테스트 A와 비교)
        </text>
      </TestResult>

      <TestResult label="color: fg.informative 직접 지정" expected="fg.informative">
        <text style={{ color: vars.$color.fg.informative }}>
          fg.informative 텍스트 (테스트 B와 비교)
        </text>
      </TestResult>

      <TestResult label="fontSize: 20px 직접 지정" expected="20px 폰트">
        <text className="text-fg-neutral" style={{ fontSize: "20px" }}>
          20px 텍스트 (테스트 B와 비교)
        </text>
      </TestResult>
    </scroll-view>
  );
}
