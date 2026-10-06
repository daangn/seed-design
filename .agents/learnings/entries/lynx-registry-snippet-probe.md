---
id: lynx-registry-snippet-probe
description: "Lynx Registry snippet(`docs/registry/lynx/ui/*.tsx`)의 눌림 상태·Scale Feedback·접근성처럼 렌더 결과를 재현하거나 회귀를 확인할 때 읽는다. snippet을 import하면 `Unexpected token '<'`, 아이콘 모듈 해석 실패, `MainThreadRef: value of a MainThreadRef cannot be accessed in the background thread`가 나는 경우와, 예제가 tap handler 없이 actionable 구성을 써서 interactive가 꺼지는 경우를 다룬다. React snippet이나 공개 패키지 컴포넌트 테스트에는 적용하지 않는다."
scope: ["docs/registry/lynx/**", "docs/examples/lynx/**", "examples/lynx-spa/src/seed-design/**", "packages/lynx-react/**"]
status: active
related: ["lynx-headless-tree-parity"]
---

# Lynx Registry snippet은 lynx-react 테스트 환경에 임시 복사해 검증한다

## 교훈과 다음 행동

- Lynx snippet에는 전용 테스트 seam이 없다. 동작을 재현하려면 `packages/lynx-react/src/components/<Name>/`에 임시 복사본과 임시 테스트를 만들고 끝나면 지운다.
  - `docs/`의 파일을 상대 경로로 직접 import하지 않는다 → Vitest가 패키지 밖 JSX를 변환하지 않아 `Unexpected token '<'`로 실패한다.
  - `@karrotmarket/lynx-monochrome-icon`은 `packages/lynx-react`에서 해석되지 않는다. `vi.mock`이나 symlink 대신 복사본의 import를 `./<Name>.namespace`, `../Icon`과 아래 아이콘 stub으로 바꾼다.
  - 아이콘 stub은 `ActionButton.test.tsx`의 `MockIcon`처럼 `forwardRef`로 받은 ref를 `main-thread:ref`로 넘긴다. 일반 함수 컴포넌트는 Icon slot의 Main Thread ref가 Background ref로 적용되어 `MainThreadRef ... background thread` 오류가 난다.
  - 비교 값은 `getAttribute`·`className` 같은 원시값으로 뽑아 단언한다. 실패 시 element를 직렬화하면 같은 MainThreadRef 오류가 원래 실패를 가린다.
- Lynx `Callout.Root`처럼 `bindtap`·`main-thread:bindtap` 유무로 interactive를 정하는 컴포넌트는, React snippet이 `<button>`으로 항상 interactive인 구성과 다르게 동작할 수 있다. actionable snippet을 만들거나 예제를 바꿀 때 handler 없이 렌더한 결과(`flatten`, `accessibility-traits`, `pressed` class)를 확인한다.

## 발생 근거와 적용 조건

- 상황(DES-2677): docs 예제 10개가 Registry `ActionableCallout`을 `bindtap` 없이 렌더해 Scale Feedback·눌림 상태·`button` 역할이 모두 꺼져 있었다(587163826부터). lynx-spa `CalloutPage`는 `bindtap`을 넘겨 증상이 드러나지 않았다.
- 재현: 위 방식의 임시 테스트가 수정 전 `{ flatten: null, traits: null, pressed: false }`로 실패했고, snippet이 기본 빈 `bindtap`을 넘기게 바꾼 뒤 통과했다. 소비자 `bindtap`도 한 번 호출됐다.
- 시행착오: 상대 경로 import, `vi.mock("@seed-design/lynx-react")`(`preact does not provide an export named 'process'`), 아이콘 symlink(아이콘 패키지 JSX 미변환), 함수형 stub(MainThreadRef 오류)이 차례로 실패했다.
- jsdom 환경에서 `__ElementAnimate` 호출로 Scale Feedback 애니메이션 자체를 관찰하는 방법은 ActionButton에서도 호출이 잡히지 않아 판별 신호가 되지 못했다. interactive 여부는 위 속성으로 판별한다.

## 변경 이력

- 2026-09-29: DES-2677 ActionableCallout Scale Feedback 누락 조사에서 작성했다.

- 2026-10-06: harness 지도에서 frontmatter를 읽을 수 있도록 description을 문자열로 감쌌다. 교훈 내용과 기존 검증 날짜는 변경하지 않았다.
