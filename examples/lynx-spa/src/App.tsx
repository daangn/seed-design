import "@seed-design/css/all.lynx.css";
import "./test.css";

export function App(props: { onRender?: () => void }) {
  props.onRender?.();

  return (
    <view
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <text style={{ fontSize: "18px", fontWeight: "bold", color: "#3498db" }}>
        === CSS Variable 테스트 ===
      </text>

      {/* 테스트 1: 직접 값 */}
      <view className="test-direct">
        <text className="test-direct__label">1. 직접 값 (background: #fa6616)</text>
      </view>

      {/* 테스트 2: 단일 var() */}
      <view className="test-single-var">
        <text className="test-single-var__label">2. 단일 var() (--my-color: #fa6616)</text>
      </view>

      {/* 테스트 3: 중첩 var() */}
      <view className="test-nested-var">
        <text className="test-nested-var__label">3. 중첩 var() (--a: var(--b), --b: #fa6616)</text>
      </view>

      {/* 테스트 4: page 토큰 단일 참조 */}
      <view className="test-page-token">
        <text className="test-page-token__label">4. page 토큰 직접 (var(--seed-color-palette-carrot-600))</text>
      </view>

      {/* 테스트 5: page 토큰 중첩 참조 */}
      <view className="test-page-nested">
        <text className="test-page-nested__label">5. page 토큰 중첩 (var(--seed-color-bg-brand-solid))</text>
      </view>

      {/* 테스트 6: CSS custom property cascade (initial → override) */}
      <view className="test-cascade test-cascade-override">
        <text className="test-cascade__label">6. cascade (--pad: initial → override 16px)</text>
      </view>
    </view>
  );
}
