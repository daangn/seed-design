---
id: docs-sidebar-pre-paint-restore
description: docs 사이드바(React island 안의 SEED SideNavigation)의 폴더·스크롤 상태를 전체 로드 사이에 되살리는 `components/layout/docs-sidebar-restore.tsx`를 고치거나, 같은 방식으로 다른 island의 상태를 첫 paint 전에 되살리려 할 때 읽는다. 느린 HTML에서 스크롤이 뒤늦게 튀는 원인, hydration과 DOM patch를 맞추는 조건, 반복 측정이 저장 상태에 오염되는 함정을 다룬다. 첫 render에서 브라우저 상태를 읽지 않는 일반 island에는 해당하지 않는다.
scope: ["docs/components/layout/**"]
status: active
related: ["docs-load-time-flicker-and-shift"]
verified_at: "2026-11-12"
---

# React가 그린 사이드바를 첫 paint 전에 되살리려면 파싱 도중의 프레임까지 맞춘다

## 교훈과 다음 행동

- 되살리는 script는 사이드바 마크업 안에 둔다. 사이드바 island 뒤에는 본문 HTML이 이어져 island 뒤의 script는 첫 paint보다 한참 늦다. React가 그린 `<script dangerouslySetInnerHTML>`은 HTML 파싱 중에 실행되고, hydration은 이를 다시 실행하지 않는다.
- 폴더 상태는 폴더마다 마지막 자식 script로 그 폴더가 파싱된 직후 고친다. 사이드바 HTML은 여러 network 조각에 걸쳐 오고 Chrome은 그 사이에도 paint한다 → 목록 끝에서 한 번에 고치면 앞쪽 폴더가 바뀌는 프레임이 보인다.
- 스크롤은 목록 끝 script에서 `scrollTop`을 맞추되, 그 전까지는 `<head>`의 `<style>`로 목록을 저장한 스크롤만큼 `translateY`로 올려 둔다. 끝 script는 style을 먼저 지우고 같은 task에서 `scrollTop`을 맞춘다. 순서를 바꾸면 transform으로 줄어든 스크롤 범위에 값이 잘린다. React가 관리하는 요소의 `style` 속성은 건드리지 않는다.
- hydration은 서버 HTML이 아니라 그때의 DOM과 비교한다. script가 바꾼 값을 전역(`window.__docsSidebarOpen`)에 남기고 첫 render가 그 값으로 state를 시작하면 mismatch가 없다. 어긋나면 dev는 `A tree hydrated but some attributes … didn't match`를 내지만 prod는 속성을 비교하지 않아 조용히 화면과 state가 갈라진다 → 바꾼 뒤에는 `astro dev`에서 저장 상태를 둔 채 경고를 확인한다.
- script 본문은 문자열 상수로 둔다. 함수의 `toString()`은 서버와 브라우저 번들에서 결과가 달라질 수 있고, `dangerouslySetInnerHTML`이 다르면 dev hydration 경고가 난다.
- headless에서 떠날 때의 저장을 흉내 내려면 `document.visibilityState`를 `hidden`으로 덮어쓴 뒤 `window.dispatchEvent(new Event("visibilitychange"))`를 쓴다. 저장 listener는 `window`에 걸려 있고 이 이벤트는 bubbling하지 않아 `document`에 dispatch하면 저장되지 않는다.
- 같은 탭에서 측정을 반복하면 떠날 때(`visibilitychange`) 저장되는 상태가 다음 run의 시작 상태가 된다. `sessionStorage.clear()` 뒤에 이동해도 다시 저장된다 → 초기화할 때 `document`에 capture listener로 `visibilitychange` 전파를 막고 비운다.

## 발생 근거와 적용 조건

- 상황: client router를 걷고 Starlight처럼 `sessionStorage` + inline script로 사이드바를 되살렸다. HTML을 16KB씩 40ms 간격으로 내려 주는 서버와 매 rAF 기록(`#nd-sidebar .seed-scroll-fog`의 `scrollTop`, 폴더 `aria-expanded`, 표시 항목의 `getBoundingClientRect().top`)으로 쟀다.
- 목록 끝에서만 `scrollTop`을 맞췄을 때: 첫 paint 260ms, 사이드바가 파싱되는 다섯 프레임 묶음(t=307–458ms) 동안 `scrollTop=0`, 표시 항목 top 1292px였다가 t=508ms에 600·692px로 튀었다.
- transform을 더한 뒤: 같은 조건 세 번 모두 표시 항목 top이 처음 보인 프레임부터 692px 하나뿐이었고, 폴더 상태는 파싱된 앞부분이 늘 최종값의 접두사였다. 빠른 서버에서는 첫 프레임부터 최종 상태였다. CLS 0.00001(사이드바 밖 header 요소).
- 대조: 첫 render가 전역을 무시하도록 막자 `astro dev`에서 위 hydration 경고가 났다. 막지 않으면 경고가 없었다.
- 저장 흉내: `astro dev`에서 `document.dispatchEvent(new Event("visibilitychange"))`로는 `sessionStorage`가 비어 있었고, `window.dispatchEvent(…)`로 바꾸자 저장된 뒤 새로 불러올 때 폴더·`scrollTop`이 되살아났다(2026-11-12).
- 적용 조건: React 19.2, Astro 7.4.6, `@seed-design/react` SideNavigation의 Collapsible 마크업(`data-open`, trigger `aria-expanded`·`aria-controls`, content `hidden`), headless Chrome.

## 변경 이력

- 2026-11-12: client router를 사이드바 상태 복원으로 바꾸는 작업에서 측정한 결과로 기록했다.
- 2026-11-12: 셸이 여러 island로 나뉜 구조에 맞게 script 위치의 근거를 고치고, headless에서 저장을 흉내 내는 방법을 더했다.
