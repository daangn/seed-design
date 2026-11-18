---
id: docs-theme-transition-measurement
description: docs 테마 전환(`d` 키·헤더 토글) 때 색 transition이 걸리는지 Playwright로 재거나, 기존 Next(next-themes `disableTransitionOnChange`) 사이트와 비교하거나, `toggleTheme`에서 transition을 끄려 할 때 읽는다. Playwright `keyboard.press`·`click`만으로 재면 Next 기준에서도 transition 0이 나와 원본 동작을 잘못 판단한다. 기준 동작의 실제 원인과 페이지 안 이벤트 + `getAnimations()` 측정법을 다룬다. 진입 시 깜빡임·CLS 측정은 `docs-load-time-measurement`가 다룬다.
scope: ["docs/src/shell/root-attributes.ts", "docs/src/shell/client.ts", "docs/src/styles/**"]
status: active
related: ["docs-load-time-measurement"]
verified_at: "2026-11-18"
---

# 테마 전환 transition은 페이지 안에서 보낸 이벤트로 잰다

## 교훈과 다음 행동

- 기존 Next 사이트에서 테마 전환 때 보이던 색 transition은 전역 규칙이 아니라 요소가 이미 선언한 transition(`transition-colors` 150ms `cubic-bezier(0.4,0,0.2,1)`, SEED SideNavigation 200ms ease, chip-tabs 150ms 등)이다. 같은 동작을 원하면 `toggleTheme`에서 transition을 끄지 않는다 → 첫 로드(paint 전 bootstrap)와 이동(swap 전 새 문서 적용)은 바뀌기 전 style이 없어 transition이 걸리지 않는다.
- next-themes `disableTransitionOnChange`(fumadocs `RootProvider` 기본값 true)는 실제 사용자 입력에서 transition을 막지 못했다. `transition:none` style을 넣고 값을 읽지 않는 `getComputedStyle(document.body)` 뒤 `setTimeout(…, 1)`로 지우므로, 그 사이 style 계산이 없으면 다음 계산 때 이미 지워져 있다.
- Playwright `keyboard.press`·`click`(CDP 입력)은 프레임에 맞춰 들어가 timer보다 먼저 style 계산이 일어난다 → Next 기준에서도 transition 0이 나와 이 동작을 가린다. 대신 `page.evaluate`에서 `requestAnimationFrame` 뒤 `setTimeout`으로 프레임 중간에 `KeyboardEvent("keydown", { key: "d" })`를 보내거나 버튼 `.click()`을 부르고, 40–60ms 뒤 `document.getAnimations()`의 `transitionProperty`·`effect.getTiming()`(duration·easing)을 모아 비교한다.
- 첫 로드·이동 검사는 init script에서 `transitionrun`을 기록한다. 이동은 mouse 대신 `element.click()`으로 시작한다(포인터 hover transition이 섞인다). TOC 활성 표시처럼 테마와 무관한 transition은 light·dark를 바꿔 같은지 보고 걸러낸다.

## 발생 근거와 적용 조건

- 2026-11-18 재이전 브랜치: Astro `toggleTheme`이 `transition:none`을 rAF 뒤 지워 전환 transition이 0이었고, 오너가 Next에는 transition이 있었다고 보고했다. seed-design.io가 이미 Astro라 Next 정적 빌드(8988118b4)를 띄워 쟀다. `keyboard.press("d")`는 Next에서도 0개, 페이지 안 이벤트는 14종 385개(`/react/components/action-button`, Chromium)였다. transition 끄기를 지운 Astro 빌드는 `keyboard.press`로도 같은 14종 385개였고 WebKit·Firefox도 같았다. `prefers-reduced-motion: reduce`에서도 Next와 같이 385개였다.
- 적용 조건: next-themes 0.4.6, fumadocs-ui 16.18.1 기준, Playwright 1.64 Chromium·WebKit·Firefox.

## 변경 이력

- 2026-11-18: 테마 전환 transition 복원 작업에서 기록했다.
