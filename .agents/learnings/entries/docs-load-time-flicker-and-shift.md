---
id: docs-load-time-flicker-and-shift
description: docs 페이지에 진입할 때 서버가 그린 예제 미리보기가 잠깐 사라졌다 나타나거나 본문이 옆으로·아래로 밀리는 현상을 조사할 때, 또는 island 안에 `React.lazy`·Suspense를 두거나 fumadocs layout의 열 폭·transition이나 layout 위의 배너(`LatestVersionBanner`)를 건드릴 때 읽는다. hydration 중 Suspense boundary가 fallback으로 떨어지는 조건, HTML이 나눠 도착할 때 `:has()`로 예약하는 열이 늦게 생기는 구조와 열 폭을 빌드 때 정하는 방법, 늦게 mount되는 배너의 자리를 첫 paint 전에 잡는 방법, 그리고 빌드 결과의 DOM 비교나 localhost 측정으로는 잡히지 않는 이 현상을 재현·측정하고 느린 서버의 조각 경계 때문에 생기는 CLS 차이를 기준과 비교하는 방법을 다룬다.
scope: ["docs/components/component-preview.tsx", "docs/components/layout/**", "docs/src/styles/global.css", "docs/components/table-of-contents.tsx", "docs/components/latest-version-banner.tsx", "docs/src/layouts/**"]
status: active
related: ["docs-dev-cascade-layer-order"]
verified_at: "2026-11-12"
---

# 진입 시 깜빡임과 밀림은 로딩 과정을 재현해야 보인다

## 교훈과 다음 행동

- 서버가 그린 콘텐츠를 island에서 `React.lazy`로 hydrate할 때는 그 주위에 Suspense boundary를 두지 않는다. boundary가 있으면 모듈을 기다리는 동안 위쪽 context가 바뀔 때 React가 서버 HTML을 버리고 fallback을 그린다. boundary가 없으면 island 전체가 서버 HTML을 유지한 채 기다린다. lazy 컴포넌트는 모듈 수준 cache에 둔다. render 안에서 만들면 중단된 hydration이 다시 시작할 때마다 새로 만들어져 로딩 중 상태로 돌아간다.
- layout의 열 폭을 하위 요소의 `:has()`(fumadocs `layout:` variant)로 정하지 않는다. 빌드 때 사이드바·목차 유무를 알므로 grid 루트(`src/layouts/DocsLayout.astro`)의 class에 직접 적는다. 열이 첫 paint부터 정해지고, 열 폭에 걸린 transition도 처음 그릴 때는 돌지 않는다.
- layout 위쪽 흐름에 늦게 들어오는 요소는 첫 paint 전에 자리를 잡는다. `LatestVersionBanner`는 `client:only`라 JS를 받은 뒤에야 그려진다 → `<head>`의 inline script가 띄울 조건을 판단해 `<html>`에 표시를 붙이고, 그 표시에 건 CSS가 같은 높이의 자리와 `--fd-banner-height`를 잡는다. 컴포넌트는 첫 render에서 표시를 읽어 바로 배너를 그리고, `useLayoutEffect`에서 표시를 지워 같은 commit에 자리를 넘긴다. effect에서 띄울지 정하면 그 사이 한 번 이상 paint된다.
- 이 배너는 `localhost`·`127.0.0.1`·운영 host에서는 뜨지 않는다(아카이브 빌드는 예외) → localhost 측정은 밀림을 놓친다. `http://docs.localhost:<port>`처럼 목록 밖 host로 같은 빌드를 띄우고, 배너가 실제로 떴는지 확인한 뒤 결과를 믿는다. 닫힘은 origin별 `localStorage`라 port가 다르면 따로 닫아야 한다.
- 느린 서버의 CLS를 기준과 비교할 때는 조각 경계가 어디에 걸리는지 함께 본다. HTML 앞쪽 크기가 바뀌면 경계가 옮겨 가, 한 줄로 늘어선 요소(가운데 정렬된 헤더 nav)가 덜 파싱된 채 그려지는 기존 점진 렌더 shift가 드러나거나 사라진다 → CLS가 달라지면 shift source의 바이트 위치를 확인하고, 기준에도 같은 경계 조건(조각 크기)을 걸어 다시 잰다.
- 진입 시 화면은 완성된 DOM 비교나 빠른 로컬 서버로는 확인할 수 없다. HTML을 작은 조각으로 천천히 내려 주는 서버로 빌드 결과를 띄우고, 페이지 init script에서 `PerformanceObserver`(`layout-shift`)와 대상 요소의 `innerHTML` 길이를 프레임마다 기록한다. 기준 빌드도 같은 조건으로 재서 비교한다.

## 발생 근거와 적용 조건

- 상황: docs를 Astro로 옮긴 뒤 dev에서 React 문서의 미리보기가 깜빡이고 Lynx 문서의 본문이 밀린다는 보고를 받았다. 빌드 결과의 정규화 DOM은 기준선과 같았다.
- 깜빡임: `@seed-design/react-tabs`의 `useIsSSR`이 mount 직후 상태를 바꿔 탭 context가 갱신된다. 그때 미리보기의 Suspense boundary가 예제 모듈을 기다리며 dehydrated 상태면 React가 클라이언트 렌더링으로 전환해 fallback(`null`)을 그린다. 미리보기 패널의 `innerHTML` 길이가 2617 → 66 → 2694로 바뀌는 것으로 확인했고, 같은 코드인 기존 운영 사이트(Next.js)에서도 같은 순서가 나왔다. Astro에서는 첫 화면이 더 일찍 그려져 눈에 띄었다.
- 밀림: 목차 열과 사이드바 열은 fumadocs의 `layout:` variant(`#nd-…-layout:has(> …)`)로 폭이 정해진다. `#nd-toc`는 본문 뒤에 있어, 문서가 다 파싱되기 전에 그려지면 열이 나중에 생긴다. HTML을 16KB씩 40ms 간격으로 내려 주면 기준선과 Astro 빌드 모두 CLS 0.062가 나왔다. Astro는 island의 props가 본문보다 앞에 직렬화돼 layout root가 먼저 그려지는 일이 잦고, 그때 `--fd-sidebar-col` transition이 0에서 열리며 CLS가 0.09~0.17까지 올랐다.
- 수정 뒤 같은 조건에서 CLS는 0.0000~0.0004, 미리보기 패널 길이는 변하지 않았다.
- 배너 밀림: 프리뷰 배포(배너가 뜨는 host)에서 사이드바 링크로 이동하면 표시 항목 top이 298px로 몇 프레임 그려진 뒤 346px로 내려갔다(CLS 0.0375, source `nd-notebook-layout`). 배너가 effect에서 `useState(false)` → `true`로 바뀌며 3rem 흐름 요소로 끼어든 탓이다. 자리를 미리 잡은 뒤 `docs.localhost`의 느린 서버(두 번)·빠른 서버, 아카이브 빌드의 localhost에서 표시 항목 top은 처음 보인 프레임부터 346px 하나였고 layout shift는 없었다. 닫은 뒤와 localhost에서는 표시도 자리도 없었다(`#nd-sidebar` top 76px, 배너가 있으면 124px).
- 열 폭을 루트에 직접 적은 뒤(2026-11-12 재검증): 16KB/40ms 서버에서 사이드바 표시 항목 top은 처음 보인 프레임부터 692px(배너 host 740px) 하나였고 사이드바·본문 밀림은 없었다(6회). 남은 CLS 0.00059는 모두 헤더 nav(`flex items-center gap-0.5`)였다. 헤더 island의 props가 줄어 nav가 HTML 62.9–65.7KB에 오면서 조각 경계 65536이 그 안에 걸린 탓이다. 같은 빌드를 45KB 조각으로 재면 0(4회), 기준 빌드를 40KB 조각(경계 120000이 nav 안)으로 재면 같은 source로 0.00252(4회)였다. 이 재검증은 열 폭 예약과 조각 경계만 다뤘고 Suspense·배너 부분은 다시 재지 않았다.
- 적용 조건: React 19.2, Astro 7.4.6, fumadocs-ui 16.18.1 notebook layout의 CSS와 grid 변수.

## 변경 이력

- 2026-11-11: docs Astro 이전 PR에서 보고받은 두 현상의 원인과 측정 방법을 기록했다.
- 2026-11-12: 최신 버전 안내 배너가 늦게 mount되며 문서를 밀던 원인과 localhost 측정이 이를 놓치는 조건을 더했다.
- 2026-11-12: 셸을 정적 레이아웃과 작은 island로 나누면서 `.docs-toc-rail`·`data-docs-hydrated`를 없애고 열 폭을 루트 class로 옮겼다. 그 방식과, 느린 서버의 조각 경계가 CLS 비교를 흔드는 조건을 더했다.
