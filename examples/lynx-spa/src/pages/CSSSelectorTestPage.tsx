import { vars } from "@seed-design/lynx-css/vars";

import "../styles/css-selector-test.css";

const { $color } = vars;

/**
 * CSS Selector 지원 검증 페이지
 *
 * enableCSSSelector: true 환경에서 Lynx 엔진이
 * 어떤 CSS selector를 실제로 지원하는지 시각적으로 검증합니다.
 *
 * 초록색 배경 = 해당 selector가 동작함
 * 빨간색 배경 = 해당 selector가 동작하지 않음 (fallback)
 * 파란색 배경 = 인터랙션 테스트 대기 상태
 */

function SectionTitle({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "20px",
        marginBottom: "8px",
        color: $color.fg.neutral,
      }}
    >
      {children}
    </text>
  );
}

function TestCase({
  id,
  label,
  expected,
  children,
}: {
  id: string;
  label: string;
  expected: string;
  children: React.ReactNode;
}) {
  return (
    <view
      style={{
        marginBottom: "8px",
        borderWidth: "1px",
        borderColor: $color.stroke.neutralMuted,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <view style={{ padding: "8px 12px", backgroundColor: $color.bg.neutralWeak }}>
        <text style={{ fontSize: "13px", fontWeight: "bold", color: $color.fg.neutral }}>
          {id}. {label}
        </text>
        <text style={{ fontSize: "11px", color: $color.fg.neutralSubtle, marginTop: "2px" }}>
          기대: {expected}
        </text>
      </view>
      <view style={{ padding: "8px 12px" }}>{children}</view>
    </view>
  );
}

function ResultBox({
  children,
  ...rest
}: { children?: React.ReactNode } & Record<string, unknown>) {
  return (
    <view
      style={{
        padding: "10px 12px",
        borderRadius: "6px",
        minHeight: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...rest}
    >
      {children}
    </view>
  );
}

function ResultText({ children }: { children: string }) {
  return <text style={{ fontSize: "13px", color: "#ffffff", fontWeight: "bold" }}>{children}</text>;
}

export function CSSSelectorTestPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>CSS Selector Test</text>
      <text style={{ fontSize: "13px", color: $color.fg.neutralSubtle, marginBottom: "8px" }}>
        enableCSSSelector: true 환경에서 CSS selector 지원 검증
      </text>

      {/* ── 1. Data-attribute selectors ── */}
      <SectionTitle>1. Data-attribute Selectors</SectionTitle>

      <TestCase id="1-1" label="[data-active] 존재 여부" expected="초록색 = 지원">
        <ResultBox data-sel-test="1-1" data-active>
          <ResultText>[data-active] 존재 → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase id="1-2" label='[data-variant="primary"] 값 매칭' expected="초록색 = 지원">
        <ResultBox data-sel-test="1-2" data-variant="primary">
          <ResultText>[data-variant=primary] → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase id="1-3" label="[data-size] 다른 값 분기" expected="파란=small, 주황=large">
        <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <ResultBox data-sel-test="1-3a" data-size="small" style={{ flex: 1 }}>
            <ResultText>small → 파란</ResultText>
          </ResultBox>
          <ResultBox data-sel-test="1-3b" data-size="large" style={{ flex: 1 }}>
            <ResultText>large → 주황</ResultText>
          </ResultBox>
        </view>
      </TestCase>

      {/* ── 2. Attribute 연산자 ── */}
      <SectionTitle>2. Attribute Selector 연산자</SectionTitle>

      <TestCase id="2-1" label='[data-text*="partial"] contains' expected="초록색 = 지원">
        <ResultBox data-sel-test="2-1" data-text="this-has-partial-in-it">
          <ResultText>*= contains → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase id="2-2" label='[data-text^="hello"] starts with' expected="초록색 = 지원">
        <ResultBox data-sel-test="2-2" data-text="hello-world">
          <ResultText>^= starts with → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase id="2-3" label='[data-text$="world"] ends with' expected="초록색 = 지원">
        <ResultBox data-sel-test="2-3" data-text="hello-world">
          <ResultText>$= ends with → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      {/* ── 3. Pseudo-classes (지원 예상) ── */}
      <SectionTitle>3. Pseudo-classes (지원 예상)</SectionTitle>

      <TestCase id="3-1" label=":active (터치 시)" expected="터치하면 파란→초록">
        <ResultBox data-sel-test="3-1">
          <ResultText>터치하면 파란→초록으로 변경</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase id="3-2" label=":not([data-excluded]) - excluded 없음" expected="초록색 = 지원">
        <ResultBox data-sel-test="3-2">
          <ResultText>:not() 매칭 → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase
        id="3-3"
        label=":not([data-excluded]) - excluded 있음"
        expected="빨간색 = :not() 정확"
      >
        <ResultBox data-sel-test="3-3" data-excluded>
          <ResultText>excluded → 빨간이면 :not() 정확</ResultText>
        </ResultBox>
      </TestCase>

      {/* ── 4. Pseudo-classes (미지원 예상) ── */}
      <SectionTitle>4. Pseudo-classes (미지원 예상)</SectionTitle>

      <TestCase
        id="4-1"
        label=":disabled"
        expected="빨간색 유지 = 미지원 확인 (PseudoState 미정의)"
      >
        <ResultBox data-sel-test="4-1">
          <text style={{ fontSize: "13px", color: "#ffffff", fontWeight: "bold" }}>
            빨간 유지 = :disabled 미지원 확인
          </text>
        </ResultBox>
        <text style={{ fontSize: "11px", color: $color.fg.neutralSubtle, marginTop: "4px" }}>
          참고: CSS에 view[data-sel-test=4-1]:disabled 룰이 없어 기본 빨간색. Lynx 엔진에 :disabled
          PseudoState가 없으므로 설령 CSS에 있어도 적용 안 됨
        </text>
      </TestCase>

      <TestCase
        id="4-2"
        label=":checked, :is() 등"
        expected="postcss-lynx-compat가 필터/확장하여 직접 테스트 불가"
      >
        <view style={{ padding: "8px", backgroundColor: $color.bg.neutralWeak, borderRadius: "6px" }}>
          <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle }}>
            :checked → filterPseudoClasses에 의해 CSS에서 제거됨{"\n"}
            :is() → postcss-lynx-compat가 개별 selector로 확장{"\n"}
            → 이들은 플러그인 설정을 변경해야 테스트 가능
          </text>
        </view>
      </TestCase>

      {/* ── 5. Combinators ── */}
      <SectionTitle>5. Combinators</SectionTitle>

      <TestCase id="5-1" label="> 자식 선택자" expected="초록색 = 지원">
        <view data-sel-test="5-1">
          <ResultBox>
            <ResultText>직접 자식 → 초록이면 OK</ResultText>
          </ResultBox>
        </view>
      </TestCase>

      <TestCase id="5-2" label="(공백) 자손 선택자" expected="초록색 텍스트 = 지원">
        <view data-sel-test="5-2">
          <view>
            <text style={{ fontSize: "13px", fontWeight: "bold" }}>
              자손 텍스트 → 초록이면 OK
            </text>
          </view>
        </view>
      </TestCase>

      <TestCase id="5-3" label="+ 인접 형제 선택자" expected="두 번째 박스 초록 = 지원">
        <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <view
            data-sel-test="5-3-trigger"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#94a3b8",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <text style={{ fontSize: "13px", color: "#ffffff", fontWeight: "bold" }}>trigger</text>
          </view>
          <ResultBox data-sel-test="5-3-target" style={{ flex: 1 }}>
            <ResultText>+ 인접 → 초록이면 OK</ResultText>
          </ResultBox>
        </view>
      </TestCase>

      <TestCase id="5-4" label="~ 일반 형제 선택자" expected="세 번째 박스 초록 = 지원">
        <view style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <view
            data-sel-test="5-4-trigger"
            style={{
              padding: "8px",
              backgroundColor: "#94a3b8",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <text style={{ fontSize: "13px", color: "#ffffff", fontWeight: "bold" }}>trigger</text>
          </view>
          <view
            style={{
              padding: "8px",
              backgroundColor: "#94a3b8",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <text style={{ fontSize: "13px", color: "#ffffff", fontWeight: "bold" }}>
              중간 형제
            </text>
          </view>
          <ResultBox data-sel-test="5-4-target">
            <ResultText>~ 일반형제 → 초록이면 OK</ResultText>
          </ResultBox>
        </view>
      </TestCase>

      {/* ── 6. 복합 선택자 ── */}
      <SectionTitle>6. Compound Selectors</SectionTitle>

      <TestCase id="6-1" label='[data-compound][data-state="active"] 복합' expected="초록색 = 지원">
        <ResultBox data-compound="true" data-state="active">
          <ResultText>[data-compound][data-state] → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      <TestCase id="6-2" label="다중 data-attr [data-a][data-b]" expected="초록색 = 지원">
        <ResultBox data-sel-test="6-2" data-a="1" data-b="2">
          <ResultText>다중 [data-a][data-b] → 초록이면 OK</ResultText>
        </ResultBox>
      </TestCase>

      {/* ── 7. :root 변수 ── */}
      <SectionTitle>7. :root (page) 선택자</SectionTitle>

      <TestCase id="7-1" label=":root에서 정의한 CSS 변수" expected="초록색 텍스트 = 지원">
        <text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "var(--css-sel-test-root-color)",
          }}
        >
          이 텍스트가 초록이면 :root CSS 변수 동작
        </text>
      </TestCase>

      {/* ── 요약 ── */}
      <SectionTitle>검증 요약</SectionTitle>
      <view
        style={{
          padding: "12px",
          backgroundColor: $color.bg.neutralWeak,
          borderRadius: "8px",
          marginBottom: "40px",
        }}
      >
        <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle, lineHeight: "18px" }}>
          {"[data-*] selector가 직접 동작하면:\n"}
          {"→ postcss-lynx-compat의 [data-*]→className 변환 제거 가능\n"}
          {"→ selectorMappings (data-seed-platform) 변환 제거 가능\n\n"}
          {":is() 미지원 확인 시:\n"}
          {"→ :is() 확장은 계속 필요\n\n"}
          {":disabled/:checked 미지원 확인 시:\n"}
          {"→ filterPseudoClasses는 계속 필요"}
        </text>
      </view>
    </scroll-view>
  );
}
