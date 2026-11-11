---
id: docs-dev-cascade-layer-order
description: docs의 `astro dev`에서만 SEED 컴포넌트의 padding·margin·border가 사라져 보이고 빌드 결과는 정상일 때, 또는 docs의 cascade layer 순서 선언이나 전역 CSS import 순서를 옮기려 할 때 읽는다. dev 서버의 CSS 주입 순서가 빌드와 달라 layer 우선순위가 뒤집히는 원인과, docs 스타일 변경을 dev와 빌드 양쪽에서 확인해야 하는 이유를 다룬다. Tailwind 유틸리티가 recipe를 못 이기는 문제(`seed-layered` 조건 누락)는 대상이 아니다.
scope: ["docs/src/layouts/**", "docs/src/styles/**", "docs/astro.config.ts"]
status: active
verified_at: "2026-11-11"
---

# cascade layer 순서는 stylesheet보다 먼저 HTML에 선언한다

## 교훈과 다음 행동

- layer 순서(`@layer theme, base, seed-base, components, seed-components, utilities;`)는 `src/layouts/Layout.astro`가 `<head>` 앞쪽에 inline `<style>`로 넣는다. CSS 파일을 첫 import로 두는 방식으로 되돌리지 않는다.
- docs 스타일을 바꾸면 빌드 결과(`astro preview`)와 `astro dev`를 둘 다 본다. CSS가 들어오는 순서가 서로 달라 한쪽만 깨질 수 있다.
- dev에서만 컴포넌트 여백이 사라지면 `document.styleSheets[0]`의 첫 규칙이 layer 순서 선언인지부터 확인한다.

## 발생 근거와 적용 조건

- 상황: docs를 Astro로 옮기면서 layer 순서를 `layer-order.css`로 두고 `Layout.astro`의 첫 import로 불러왔다. 빌드 결과는 기존 사이트와 같았지만 `astro dev`에서는 사이드바 항목과 내비게이션 메뉴의 padding이 0이 됐다.
- 원인: dev 서버는 모듈마다 `<style>`을 따로 주입하고, recipe CSS(`@layer seed-components { … }`)가 `layer-order.css`보다 먼저 들어왔다. 먼저 등장한 layer가 가장 낮은 우선순위를 가지므로 `seed-components`가 Tailwind `base`보다 낮아졌고, preflight의 `* { padding: 0 }`이 recipe의 padding을 덮었다. 빌드는 import 순서대로 CSS를 묶어 순서가 맞았다.
- 확인: inline 선언으로 바꾼 뒤 5개 페이지에서 dev와 빌드 결과의 요소별 computed style과 페이지 높이가 같았다.
- 같은 문제와 해법이 사용자용 문서 `docs/content/react/getting-started/styling/cascade-layers.mdx`「Chunk Splitting 사용 시 레이어 순서 문제」에 있다.
- 적용 조건: Astro 7.4.6, Tailwind CSS 4 preflight와 `seed-layered` 조건으로 불러온 recipe를 함께 쓰는 구성.

## 변경 이력

- 2026-11-11: docs Astro 이전 PR에서 dev 스타일이 깨진다는 보고를 받고 원인과 수정을 기록했다.
