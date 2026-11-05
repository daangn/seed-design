---
id: lynx-spread-children-dropped
description: Lynx headless·styled 컴포넌트가 `const { a, ...nativeProps } = props`로 남은 props를 `<view {...nativeProps} />`처럼 self-closing intrinsic 요소에 펼칠 때, 또는 `@lynx-js/react/testing-library` 렌더 결과에서 컴포넌트의 자식(`<text>` 등)이 통째로 사라질 때 읽는다. spread에 섞인 `children`이 렌더되지 않는 관찰 결과와 `children`을 분리해 JSX 자식으로 넘기는 작성 기준을 다룬다. 자식이 렌더되지만 위치·style이 틀린 문제에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-headless-tree-parity", "lynx-ref-callback-state-loop"]
verified_at: "2026-10-01"
---

# intrinsic 요소에 spread한 `children`은 렌더되지 않는다

## 교훈과 다음 행동

- 컴포넌트 props를 intrinsic 요소에 펼칠 때 `children`을 먼저 분리하고 JSX 자식으로 넘긴다.

```tsx
const { children, thumbIndex, style, ...nativeProps } = props;
return (
  <view {...nativeProps} style={style}>
    {children}
  </view>
);
```

- 타입에 `children`이 있는 props 인터페이스를 `...rest`로 펼치는 컴포넌트는 모두 확인한다. 타입 검사와 렌더 오류가 없고 자식만 조용히 빠진다.
- 자식을 가진 장면을 한 번 렌더해 자식 text·class가 tree에 있는지 확인한다. 자식 없는 장면만 있는 parity 테스트로는 발견되지 않는다.

## 발생 근거와 적용 조건

- DES-2629에서 `@seed-design/lynx-react-slider`의 `SliderValueIndicatorRoot`를 `<view {...rootProps} {...nativeProps} ... />`로 작성했다. `nativeProps`에 `children`이 남아 있었지만 `<Slider.ValueIndicatorLabel>`이 렌더되지 않아 `querySelector("text")`가 실패했다. `children`을 분리해 자식으로 넘기자 통과했다.
- `@lynx-js/react` 0.117.0 테스트 환경의 최소 재현: `<view className="a" {...props} />`에 `<text>in-a</text>`를 자식으로 주면 `.a`의 innerHTML이 빈 문자열이었고, `children`을 분리한 `<view className="b" {...rest}>{children}</view>`는 `<text>in-b</text>`를 렌더했다.
- 기기(`examples/lynx-spa`의 `@lynx-js/react` 0.123.3)에서 spread한 `children`을 따로 재현하지는 않았다. 기기에서 렌더된다는 이유로 spread 방식을 유지하지 않는다.

## 변경 이력

- 2026-10-01: DES-2629 Slider Headless 분리 중 발견해 기록했다.
