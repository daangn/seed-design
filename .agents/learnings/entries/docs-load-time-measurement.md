---
id: docs-load-time-measurement
description: docs 페이지에 진입할 때 서버가 그린 예제 미리보기가 잠깐 사라졌다 나타나거나 본문·사이드바가 밀리는 현상을 조사·검증할 때, 또는 island 안에 `React.lazy`·`<Suspense>`를 두거나 layout 위쪽 흐름에 늦게 나타나는 요소(배너)를 더하려 할 때 읽는다. 완성된 DOM 비교나 빠른 로컬 서버로는 보이지 않는 이 현상을 재현·측정하는 방법과, hydration 중 Suspense boundary가 fallback으로 떨어지는 조건을 다룬다. 클라이언트 이동 중의 지연·같은 프레임 판정은 대상이 아니다.
scope: ["docs/src/layouts/**", "docs/src/mdx/islands/**", "docs/src/components/**", "docs/src/shell/root-attributes.ts", "docs/src/styles/**"]
status: active
related: ["docs-dev-cascade-layer-order"]
verified_at: "2026-11-11"
---

# 진입 시 깜빡임과 밀림은 로딩 과정을 재현해야 보인다

## 교훈과 다음 행동

- 진입 시 화면은 완성된 DOM 비교나 빠른 로컬 서버로 확인하지 않는다. 빌드 결과를 HTML을 작은 조각(16KB, 40ms 간격)으로 내려 주는 reverse proxy 뒤에 띄우고, 페이지 init script에서 `PerformanceObserver`(`layout-shift`)와 대상 요소의 `innerHTML` 길이·위치를 rAF마다 기록한다. 기준 빌드도 같은 조건으로 재서 비교한다.
- 서버가 그린 콘텐츠를 island에서 지연 로드할 때는 island 안에 Suspense boundary를 두지 않는다. boundary가 있으면 모듈을 기다리는 동안 위쪽 context가 바뀔 때 React가 서버 HTML을 버리고 fallback을 그린다. 지금 예제 island는 lazy glob + 모듈 promise cache + React 19 `use()`로 이 조건을 피한다(`src/mdx/islands/example-modules.ts`). lazy 컴포넌트를 render 안에서 만들지 않는다.
- layout 위쪽 흐름에 늦게 들어오는 요소는 첫 paint 전에 자리를 정한다. 지금 배너는 정적 HTML이고 표시 여부는 `<head>` inline bootstrap(`src/shell/root-attributes.ts`)이 `<html>` 속성으로 정한다. effect에서 띄울지 정하면 그 사이 paint가 한 번 이상 생긴다.
- 배너는 `root-attributes.ts`의 숨김 host(운영 host, `localhost`, `127.0.0.1`, `.localhost`·`.test` 접미사)에서는 뜨지 않는다 → 로컬 측정은 배너로 인한 밀림을 놓친다. 배너가 포함된 경우를 재려면 목록 밖 host로 띄우고 배너가 실제로 떴는지 확인한 뒤 결과를 믿는다.

## 발생 근거와 적용 조건

- 첫 Astro 이전(c1a2105fd, 2026-11-11): 빌드 결과의 정규화 DOM은 기준과 같았지만 React 문서 미리보기가 깜빡이고 Lynx 문서 본문이 밀린다는 보고를 받았다. 미리보기 패널 `innerHTML` 길이가 2617 → 66 → 2694로 바뀌었다. 원인은 탭 context(`useIsSSR`)가 mount 직후 바뀔 때 dehydrated 상태의 Suspense boundary가 fallback으로 전환된 것이었다. 같은 코드인 Next 사이트에서도 같은 순서가 나왔다. 열 밀림은 fumadocs `layout:` variant(`:has()`)로 정해지는 열이 본문 뒤의 `#nd-toc` 파싱 뒤에야 생겨 CLS 0.09–0.17이었고, `client:only` 배너가 effect에서 나타나 CLS 0.0375였다. 같은 측정법으로 수정 뒤 CLS 0.0000–0.0004, 패널 길이 변화 없음을 확인했다.
- 재이전(2026-11-13 기준선): 같은 느린 HTML 조건에서 Next 운영 사이트도 첫 로드에 미리보기 14개 `innerHTML` 합이 15,015 → 924로 줄었고(세 엔진), CLS는 React action-button 0.0373이었다. 재이전 설계는 열 폭을 정적 CSS 그리드로 정하고 예제 island 안에 Suspense를 두지 않는다.
- 적용 조건: React 19.2, Astro 7.4.x. 느린 서버 조건의 수치는 측정 환경에 따라 다르므로 같은 run에서 기준과 비교한다.

## 변경 이력

- 2026-11-11: 첫 Astro 이전 PR에서 `docs-load-time-flicker-and-shift`로 기록했다(revert ac0162349로 삭제).
- 2026-11-18: 재이전 뒤 지금 구조에서도 유효한 측정법과 Suspense 조건만 남겨 새 ID로 다시 기록했다. 되돌린 코드(`.docs-toc-rail`, `client:only` 배너 자리 선점)에 묶인 대응은 뺐고, 배너 숨김 host 목록을 지금 코드로 고쳤다.
