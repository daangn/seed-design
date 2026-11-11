---
id: docs-load-time-flicker-and-shift
description: docs 페이지에 진입할 때 서버가 그린 예제 미리보기가 잠깐 사라졌다 나타나거나 본문이 옆으로 밀리는 현상을 조사할 때, 또는 island 안에 `React.lazy`·Suspense를 두거나 fumadocs layout의 열 폭·transition을 건드릴 때 읽는다. hydration 중 Suspense boundary가 fallback으로 떨어지는 조건, HTML이 나눠 도착할 때 `:has()`로 예약하는 열이 늦게 생기는 구조, 그리고 빌드 결과의 DOM 비교로는 잡히지 않는 이 현상을 재현·측정하는 방법을 다룬다.
scope: ["docs/components/component-preview.tsx", "docs/components/layout/**", "docs/src/styles/global.css", "docs/components/table-of-contents.tsx"]
status: active
related: ["docs-dev-cascade-layer-order"]
verified_at: "2026-11-11"
---

# 진입 시 깜빡임과 밀림은 로딩 과정을 재현해야 보인다

## 교훈과 다음 행동

- 서버가 그린 콘텐츠를 island에서 `React.lazy`로 hydrate할 때는 그 주위에 Suspense boundary를 두지 않는다. boundary가 있으면 모듈을 기다리는 동안 위쪽 context가 바뀔 때 React가 서버 HTML을 버리고 fallback을 그린다. boundary가 없으면 island 전체가 서버 HTML을 유지한 채 기다린다. lazy 컴포넌트는 모듈 수준 cache에 둔다. render 안에서 만들면 중단된 hydration이 다시 시작할 때마다 새로 만들어져 로딩 중 상태로 돌아간다.
- layout의 열 폭을 뒤에 오는 요소의 `:has()`로 정하지 않는다. 앞에 오는 요소로 먼저 예약한다(`.docs-toc-rail`). 열 폭에 걸린 transition은 hydrate 전에는 끈다(`data-docs-hydrated`).
- 진입 시 화면은 완성된 DOM 비교나 빠른 로컬 서버로는 확인할 수 없다. HTML을 작은 조각으로 천천히 내려 주는 서버로 빌드 결과를 띄우고, 페이지 init script에서 `PerformanceObserver`(`layout-shift`)와 대상 요소의 `innerHTML` 길이를 프레임마다 기록한다. 기준 빌드도 같은 조건으로 재서 비교한다.

## 발생 근거와 적용 조건

- 상황: docs를 Astro로 옮긴 뒤 dev에서 React 문서의 미리보기가 깜빡이고 Lynx 문서의 본문이 밀린다는 보고를 받았다. 빌드 결과의 정규화 DOM은 기준선과 같았다.
- 깜빡임: `@seed-design/react-tabs`의 `useIsSSR`이 mount 직후 상태를 바꿔 탭 context가 갱신된다. 그때 미리보기의 Suspense boundary가 예제 모듈을 기다리며 dehydrated 상태면 React가 클라이언트 렌더링으로 전환해 fallback(`null`)을 그린다. 미리보기 패널의 `innerHTML` 길이가 2617 → 66 → 2694로 바뀌는 것으로 확인했고, 같은 코드인 기존 운영 사이트(Next.js)에서도 같은 순서가 나왔다. Astro에서는 첫 화면이 더 일찍 그려져 눈에 띄었다.
- 밀림: 목차 열과 사이드바 열은 fumadocs의 `layout:` variant(`#nd-…-layout:has(> …)`)로 폭이 정해진다. `#nd-toc`는 본문 뒤에 있어, 문서가 다 파싱되기 전에 그려지면 열이 나중에 생긴다. HTML을 16KB씩 40ms 간격으로 내려 주면 기준선과 Astro 빌드 모두 CLS 0.062가 나왔다. Astro는 island의 props가 본문보다 앞에 직렬화돼 layout root가 먼저 그려지는 일이 잦고, 그때 `--fd-sidebar-col` transition이 0에서 열리며 CLS가 0.09~0.17까지 올랐다.
- 수정 뒤 같은 조건에서 CLS는 0.0000~0.0004, 미리보기 패널 길이는 변하지 않았다.
- 적용 조건: React 19.2, Astro 7.4.6, fumadocs-ui notebook layout.

## 변경 이력

- 2026-11-11: docs Astro 이전 PR에서 보고받은 두 현상의 원인과 측정 방법을 기록했다.
