import '../styles/nested-vars-test.css';

/**
 * Lynx 3.6+ Nested CSS Variables 테스트 페이지
 *
 * 검증 항목:
 * A. CSS 파일에서 nested var() — page 토큰 중첩 참조가 런타임에 resolve되는지
 * B. style={{ '--x': value }} — 객체 형태로 CSS variable 설정이 동작하는지
 * C. 직접 값 — 비교 기준
 */

function SectionTitle({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '16px',
        marginBottom: '8px',
      }}
    >
      {children}
    </text>
  );
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
    <view
      style={{
        padding: '8px',
        marginBottom: '6px',
        borderBottomWidth: '1px',
        borderBottomColor: '#eee',
      }}
    >
      <text style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>
        {label} (기대: {expected})
      </text>
      {children}
    </view>
  );
}

export function NestedVarsTestPage() {
  return (
    <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Nested CSS Variables Test
      </text>
      <text style={{ fontSize: '13px', color: '#999' }}>
        Lynx 3.6+ nested var() 지원 검증
      </text>

      {/* ── 테스트 A: CSS 파일의 nested var() ── */}
      <SectionTitle>A. CSS nested var() (클래스 기반)</SectionTitle>

      <TestResult
        label="1단계 중첩: --test-fg-brand = var(--test-palette-brand)"
        expected="#fa6616 색상"
      >
        <text className="nested-test-brand">
          이 텍스트가 주황색이면 1단계 nested var() 동작
        </text>
      </TestResult>

      <TestResult
        label="1단계 중첩: --test-fg-critical = var(--test-palette-critical)"
        expected="#e53e3e 색상"
      >
        <text className="nested-test-critical">
          이 텍스트가 빨간색이면 1단계 nested var() 동작
        </text>
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
        <view style={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <text className="nested-test-brand">
            이 텍스트 주변에 16px padding이 있으면 calc(var()) 동작
          </text>
        </view>
      </TestResult>

      {/* ── 테스트 B: style 객체로 CSS variable 설정 ── */}
      <SectionTitle>{"B. style={{ '--x': value }} 객체 형태"}</SectionTitle>

      <TestResult
        label="style={{ '--test-inline-color': '#0066ff' }}"
        expected="파란색 텍스트"
      >
        <view
          style={{ '--test-inline-color': '#0066ff' } as Record<string, string>}
        >
          <text style={{ color: 'var(--test-inline-color)' }}>
            이 텍스트가 파란색이면 style 객체로 CSS var 설정 동작
          </text>
        </view>
      </TestResult>

      <TestResult
        label="style={{ '--size': '20px' }} + font-size: var(--size)"
        expected="20px 폰트"
      >
        <view
          style={{ '--test-inline-size': '20px' } as Record<string, string>}
        >
          <text style={{ fontSize: 'var(--test-inline-size)' }}>
            이 텍스트가 20px이면 style 객체 var() 참조 동작
          </text>
        </view>
      </TestResult>

      <TestResult
        label="CSS var 상속: 부모에서 설정 → 자식에서 사용"
        expected="녹색 텍스트"
      >
        <view
          style={{ '--test-inherited': '#00aa00' } as Record<string, string>}
        >
          <view>
            <text style={{ color: 'var(--test-inherited)' }}>
              이 텍스트가 녹색이면 CSS var 상속 동작
            </text>
          </view>
        </view>
      </TestResult>

      {/* ── 테스트 C: 직접 값 (비교 기준) ── */}
      <SectionTitle>C. 직접 값 (비교 기준)</SectionTitle>

      <TestResult label="color: #fa6616 직접 지정" expected="주황색">
        <text style={{ color: '#fa6616', fontSize: '14px' }}>
          주황색 텍스트 (테스트 A와 비교)
        </text>
      </TestResult>

      <TestResult label="color: #0066ff 직접 지정" expected="파란색">
        <text style={{ color: '#0066ff' }}>
          파란색 텍스트 (테스트 B와 비교)
        </text>
      </TestResult>

      <TestResult label="fontSize: 20px 직접 지정" expected="20px 폰트">
        <text style={{ fontSize: '20px' }}>20px 텍스트 (테스트 B와 비교)</text>
      </TestResult>
    </view>
  );
}
