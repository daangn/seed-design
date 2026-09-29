# packages/lynx-react

`@seed-design/react`의 Lynx 대응 스타일드 컴포넌트 패키지(`@seed-design/lynx-react`)다. `@seed-design/lynx-css` Recipe와 `packages/lynx-react-headless/*` 로직을 조합하며 Lynx 런타임 제약을 따른다.

## 검증

루트 `bun test:lynx-react`가 기본이다. 이 패키지만 빠르게 돌릴 때:

- `bun --filter @seed-design/lynx-react test`: Vitest와 ReactLynx Testing Library
- `bun --filter @seed-design/lynx-react typecheck`: 소스와 테스트 tsconfig를 둘 다 검사

## 규칙

### 런타임 불변식

어기면 타입 검사는 통과하고 기기에서만 깨진다.

- intrinsic tag(`<view>`, `<text>`, `<image>`) → 컴포넌트 파일 안에서 리터럴 JSX로 렌더링한다. 변수 tag, `React.createElement("view", ...)`, 공통 유틸의 native tag factory, `withProvider`·`withContext`에 intrinsic string 전달을 쓰지 않는다. `React.createElement` 형태로 컴파일되어 Lynx 컴파일러의 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found` 런타임 오류를 낸다(`src/utils/create-slot-recipe-context.tsx`의 `assertNotIntrinsicComponent`가 막는다). slot factory가 필요하면 `components/SwipeableMenuSheet/SwipeableMenuSheet.tsx`의 `createViewSlot`처럼 파일 안에서 리터럴 JSX를 반환한다.
- `children` → `{...nativeProps}`에 섞지 않는다. `const { children, ...nativeProps } = restProps`로 분리해 JSX children으로 넘긴다.
- ref → `forwardRef`에서 null ref를 Lynx primitive에 넘기지 않는다. `{...(ref ? { ref } : {})}`로 있을 때만 전달한다.
- CSS `inherit` → Lynx가 지원하지 않는다. 필요한 값은 요소에 직접 적용한다.

### 파일과 공개 API

- 컴포넌트는 `src/components/<ComponentName>/`에 `<ComponentName>.tsx`, `index.ts`, 필요하면 `<ComponentName>.namespace.ts`를 둔다. 훅은 `src/hooks/<useName>.ts`, 유틸은 `src/utils/<util-name>.ts`에 둔다.
- 테스트는 대상 옆 `<file>.test.{ts,tsx}`에 둔다(`Menu/__tests__/`만 예외).
- 새 공개 모듈 → 컴포넌트 `index.ts`에서 이름으로 re-export하고 `src/index.ts`까지 연결해야 공개된다.

### 컴포넌트 구성

- 모든 컴포넌트는 `React.forwardRef`와 `displayName`을 쓴다.
- Recipe는 `@seed-design/lynx-css/recipes/<name>`에서 import하고, Recipe className과 사용자 `className`을 `clsx`로 병합한다. React 레이어에 `style`을 직접 쓰지 않는다 → Recipe로 옮긴다.
- variant props(`size`, `tone`, `variant` 등)를 손으로 destructuring하거나 타입 캐스트로 분리하지 않는다 → 단일 Recipe는 `recipe.splitVariantProps(props)`, 여러 Recipe는 `src/utils/split-multiple-variants-props.ts`의 `splitMultipleVariantsProps(props, recipes)`, compound Recipe는 `createSlotRecipeContext`가 주는 분리 도구를 쓴다.
- compound Recipe의 className·slot 연결 → `../../utils/create-slot-recipe-context`의 `createSlotRecipeContext`. 이 도구는 className·slot 연결만 맡는다.
- checked, disabled, 계산된 문자열, ref 같은 런타임 상태 → 컴포넌트 파일의 `React.createContext`로 전달한다. context가 없으면 throw해 잘못된 조합을 드러낸다.

### floating 레이어

Menu·Select·HelpBubble처럼 화면 위에 뜨는 레이어의 host 규칙이다. iOS 시뮬레이터(LynxExplorer, Lynx SDK 1.4.0)와 Android 실기기(Galaxy SM-F971N, Lynx Go)에서 확인했다. 탭 전달은 Android 실제 터치로만 확인했다.

- raw `<overlay>`를 쓰지 않는다 → `@lynx-js/lynx-ui-overlay`의 `OverlayView`를 감싸지 않고 직접 쓴다. `container`가 없으면 `<view>`, 있으면 native `<overlay>`로 렌더링한다. Dialog·Sheet 계열이 쓰는 lynx-ui `DialogView`·`SheetView`도 같은 `OverlayView`다.
- 레이어 host 파트는 `Pick<OverlayViewProps, "container" | "overlayLevel" | "overlayViewProps">`를 공개 Props로 둔다. Dialog 계열의 `dialogViewProps`, Sheet 계열의 `nativeProps`는 native pass-through 이름으로 유지한다. Registry의 단일 조립 컴포넌트는 `container`·`overlayLevel`만 받아 전달한다.
- `OverlayView`는 배치 스타일을 정하지 않는다. `className`·`style`은 view 모드에서 레이어 `<view>`, overlay 모드에서 `<overlay>` 안의 `<view>`에 붙는다 → view 모드는 `position: fixed`, overlay 모드는 `relative`로 컴포넌트가 바꾼다(`DialogView`·`SheetView`와 같다). view 모드 레이어는 Lynx view 안에만 그려지고, `container="window"` 레이어는 Lynx view 밖 host의 native 내비게이션 바까지 덮는다.
- 비모달 레이어(HelpBubble의 `closeOnInteractOutside={false}`)는 view 모드에서 전체 화면 크기를 주지 않는다 → 전체 화면 레이어는 아래 요소의 탭을 가로챈다.
- overlay 모드의 레이어 `<view>`는 `event-through`가 기본 `true`라 backdrop이 탭을 받지 못하고 아래 화면으로 넘긴다. 이 값은 자식에게 상속된다.
  - 바깥 탭을 막고 backdrop에서 받는 레이어(Menu·Select) → `overlayViewProps`에 `"event-through": false`를 넣는다.
  - 바깥 탭을 아래 화면에 넘기는 비모달 레이어 → 기본값을 두고, 탭을 받아야 하는 콘텐츠 요소에 `event-through={false}`를 준다. 빠뜨리면 콘텐츠 탭도 아래로 넘어간다.
- 열린 뒤 측정은 열림 effect에서 한다. 두 모드·두 플랫폼 모두 effect 시점의 `boundingClientRect`가 최종 값과 같았다. `bindshowoverlay`에 기대지 않는다 → iOS는 `visible` 상태로 mount한 `<overlay>`에서 이 이벤트를 보내지 않고, `visible`이 false→true로 바뀔 때만 보낸다(Android는 mount 때도 보낸다).
- `boundingClientRect`의 `relativeTo: "screen"` 기준이 플랫폼마다 다르다(iOS는 화면, Android는 Lynx view 기준). 위치는 레이어 rect를 뺀 레이어 기준 좌표로 계산한다(Menu·Select의 `overlayRect` 방식).
- `overlayViewProps.visible`은 `OverlayView`의 `overlayLevel` 지연 표시(첫 2 frame 숨김, lynx-ui가 밝힌 Android 예외 회피)를 덮어쓴다 → 닫힌 동안 mount를 유지할 때만 `visible: false`를 넘기고 열 때는 넘기지 않는다. view 모드는 `visible`이 없으므로 레이어에 `display: none`을 준다. 숨길 때 레이어 안 `bindlayoutchange`가 0 크기로 오므로 측정에 쓰지 않는다.
- `binddismissoverlay`는 `<overlay>`가 `visible=false`가 될 때마다 온다. 소비자가 `visible: false`로 숨길 때와, iOS에서 `overlayLevel`을 지정해 mount한 직후(지연 표시 전)에도 온다 → 이 둘을 `"dismiss"` reason으로 처리하지 않는다.
- Android 뒤로 가기는 overlay 모드에서 `bindrequestclose`로 오고 페이지는 남는다. view 모드에는 `binddismissoverlay`·`bindrequestclose`가 없어 레이어를 닫을 수 없고, 뒤로 가기는 host 페이지 자체를 닫는다.

### 애니메이션

- 프레임 기반 → `requestAnimationFrame`을 쓴다. `setInterval`을 쓰지 않는다.
- main thread 애니메이션 → `useMainThreadRef`, `main-thread:ref`, `"main thread"` directive 같은 기존 패턴을 따른다. thread 사이에 공유하는 함수는 각 실행 환경의 directive 규칙을 확인한다.
- 반복 애니메이션 → React state 대신 `setStyleProperty`·`setStyleProperties`로 스타일을 직접 갱신한다.

### 웹과의 차이 문서화

- Lynx가 지원하지 않는 prop → 타입에서 `Omit`하고 `@platform Lynx` JSDoc을 단다.
- Lynx 지원 범위를 바꿈 → `docs/content/lynx/components/<component>.mdx`도 확인한다.
- frontmatter `compatibility.lynx` → 확정된 Lynx Engine 최소 버전과 XElement가 있을 때만 쓴다.
