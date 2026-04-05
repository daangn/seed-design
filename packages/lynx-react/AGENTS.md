# AGENTS.md — packages/lynx-react

## 디렉토리 개요

Lynx 플랫폼용 스타일드 React 컴포넌트 패키지. `@seed-design/react`의 Lynx 대응 버전으로, Lynx 런타임 제약에 맞춘 구현을 제공한다.

## Lynx 런타임 주의사항

### style prop은 string으로 전달

Lynx는 style object를 빌드 타임에 정적 CSS로 컴파일한다. 동적 CSS custom property 값을 설정하려면 **string literal**로 전달해야 한다.

```tsx
// ❌ 동적 값 무시됨
<view style={{ "--seed-box-background": value }} />

// ✅ dynamicStyle() 유틸 사용
import { dynamicStyle } from "../../utils/dynamic-style";
<view style={dynamicStyle({ "--seed-box-background": value })} />
```

### children은 nativeProps와 분리

`{...nativeProps}`로 spread하면 `children`이 포함되어 Lynx의 `commitPatchUpdate`에서 circular reference 에러 발생. 항상 children을 별도로 추출해서 JSX children으로 전달한다.

```tsx
const { children, ...nativeProps } = restProps;
<view {...nativeProps}>{children}</view>
```

### ref null 가드

Lynx의 `applyRef`는 null ref에 `.current`를 설정하려고 에러를 던진다. `forwardRef` 사용 시 ref가 null이면 전달하지 않는다.

```tsx
const mergedProps = {
  ...(ref ? { ref } : {}),
  className,
  style,
};
```

### inherit 키워드 미지원

Lynx는 CSS `inherit` 키워드를 지원하지 않는다. CSS variable을 `inherit`로 초기화하는 패턴(웹의 `.seed-text`)은 Lynx에서 동작하지 않으므로, 스타일을 요소에 직접 적용해야 한다.

### 애니메이션 패턴

Lynx에서 프레임 기반 애니메이션을 구현할 때는 다음 패턴을 따른다. lynx-ui(Lynx 공식 UI 라이브러리)의 패턴과 일치한다.

1. **`requestAnimationFrame` 사용** (`setInterval` 사용 금지)
   - 디스플레이 refresh rate에 동기화됨
   - `setInterval`은 프레임 타이밍과 무관하게 실행되어 jank 유발

2. **Main thread 실행** (`'main thread'` directive)
   - 애니메이션 로직은 main thread에서 실행하여 크로스 스레드 오버헤드 제거
   - `useMainThreadRef`로 element 참조 획득, `main-thread:ref` 속성으로 바인딩

3. **직접 스타일 변경** (`setStyleProperty` / `setStyleProperties`)
   - React `setState` 대신 DOM 직접 조작으로 리렌더 제거
   - 다수 인스턴스가 동시에 애니메이션할 때 성능 차이가 극적

4. **인스턴스별 독립 루프** (현재 제약)
   - Lynx main thread에서 모듈 레벨 `Map`/`Set` 사용 불가로 공유 루프 구현 불가
   - 각 인스턴스가 독립 RAF 루프 실행. 다수 인스턴스 시 성능 저하 가능
   - `clip-path`가 Lynx에서 animatable이 아니라 JS로 매 프레임 SVG path 생성 필요

5. **스레드 간 함수 공유 불가**
   - `"main thread"` directive 함수는 background thread(render)에서 호출 불가 (worklet 변환됨)
   - 반대로 directive 없는 함수는 main thread 번들에 미포함
   - 양쪽에서 필요한 로직은 각 스레드용 복사본 유지 (예: `bgPieClipPath` + `pieClipPath`)

## 파일 작성 컨벤션

- 컴포넌트: `src/components/<ComponentName>/<ComponentName>.tsx` + `index.ts`
- 유틸리티: `src/utils/<util-name>.ts`
- 빌드: `tsc`로 `lib/`에 출력
