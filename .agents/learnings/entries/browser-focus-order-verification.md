---
id: browser-focus-order-verification
description: Popover·HelpBubble의 바깥 클릭 후 포커스나 열림 직후 Tab 순서를 검증할 때 읽는다. happy-dom과 실제 브라우저의 이벤트 순서·가시성 차이로 생기는 오판을 구분한다.
scope: ["packages/react-headless/**", "packages/react/**", "examples/stackflow-spa/**"]
status: active
---

# 포커스 순서와 가시성은 실제 브라우저에서도 확인한다

## 교훈과 다음 행동

- 포인터로 바깥을 누르는 동작과 열림 직후 Tab 순서는 실제 브라우저 입력으로 확인한다. focusin 시각과 document.activeElement를 기록하고 필요하면 속성 변경 순간을 계측한다. 닫힌 content는 사라질 수 있는 aria-controls 대신 class나 data 속성으로 찾는다. 자동 회귀 테스트는 examples/stackflow-spa/e2e의 Playwright로 작성한다. 이벤트 순서·가시성에 의존하지 않는 키보드 및 프로그래밍 포커스는 단위 테스트로 검증한다.

## 발생 근거와 적용 조건

- 바깥 텍스트 필드를 누르면 happy-dom은 trigger에 포커스가 남았지만 Chrome에서는 trigger를 약 10ms 거쳐 필드로 이동했다. pointerdown 닫힘, microtask 포커스 복귀, mousedown 기본 동작의 차이였다. autoFocus=false HelpBubble은 content가 첫 commit에서 display:none인 동안 tabbable을 검사해 Chrome에서만 tabindex=0이 남았다. happy-dom은 레이아웃이 없어 displayCheck=none으로 이 문제를 가렸다. 닫힌 trigger의 aria-controls 부재도 content unmount의 근거가 되지 않는다.

## 변경 이력

- 2026-09-29: major rebase에서 AGENT_LEARNINGS.md 원문 commit `629a64d99`의 교훈을 이관했다. 이관 과정에서 실행 재검증하지 않았다.
