---
id: lynx-headless-tree-parity
description: Lynx styled 컴포넌트를 headless hook으로 분리하면서 Provider·context·native 이벤트 전달을 바꿀 때 읽는다. 공개 API·화면이 같아도 생길 수 있는 할당 증가·이중 이벤트 바인딩·disabled 누락을 찾기 위한 element tree 전후 비교와 기기 성능 검증을 다룬다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["isolated-regression-baselines"]
---

# Headless 분리 리팩터링은 native tree 직렬화로 회귀를 막는다

## 교훈과 다음 행동

- hook이 memo된 객체를 반환하게 한다. styled 층은 기존 context 값을 `{ ...api, variantProps }`로 확장해 Provider 수를 유지한다. hook prop 중 기존에 native로 바인딩하지 않던 key는 분해해서 원래 경로로만 넘긴다. `main-thread:*` 핸들러의 disabled gate는 `packages/lynx-react-headless/toggle/src/Toggle.tsx`처럼 명시한다.
- 다음 순서로 검증한다.
  - 리팩터링 전 임시 테스트(`<Component>.parity.test.tsx`)로 공개 API만 import해 조합·상태별 element tree를 JSON으로 저장한다. 대상은 태그, 정렬된 className, inline style, 속성, 이벤트 핸들러 key 집합이다.
  - 변경 후 같은 테스트를 다시 실행해 `cmp`로 byte 동일성을 확인한다. 임시 파일은 typecheck를 깨뜨릴 수 있으므로 `bun test:lynx-react` 최종 실행 전에 삭제한다.
  - 기기 성능은 변경 전과 변경 후 bundle을 번갈아(B,A,B,A…) 5회 이상 Perfetto로 측정하고, 중앙값 차이를 변경 전 실행 간 편차와 비교한다.

## 발생 근거와 적용 조건

- 상황: Lynx Accordion을 headless hook으로 옮길 때 첫 구현에 네 가지 문제가 있었다.
  - hook이 매 렌더 새 객체를 반환했고, styled·headless 컴포넌트가 이를 `useMemo`로 다시 감쌌다.
  - styled Root에 variant 전용 Provider가 하나 늘었다.
  - `triggerProps`의 `bindtouch*`를 styled view에 펼치면 `useScaleFeedback`의 `main-thread:bindtouch*`와 이중으로 바인딩될 위험이 있었다.
  - headless Trigger가 disabled일 때 `main-thread:bindtap`을 막지 않았다.
- 영향: reactlynx-best-practices 리뷰가 잡기 전까지 성능 회귀(할당·Provider·context read 증가)와 disabled 동작 결함이 있었다. 두 차례 수정 작업이 필요했다.
- 피할 패턴: hook 결과를 소비처마다 `useMemo(() => api, [fields])`로 감싸는 것. 스타일 전용 값을 옮기려고 새 Provider를 추가하는 것. hook이 준 prop 객체 전체를 native view에 펼치는 것.
- 위험: 렌더마다 할당과 context 무효화가 늘고, 기존 native tree에 없던 이벤트 key가 추가된다. 테스트와 화면은 통과해도 성능이 회귀한다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: frontmatter만으로 읽기 대상을 고를 수 있도록 대상·적용 조건·본문에서 다루는 판단을 보강했다. 실행 재검증은 하지 않았다.
