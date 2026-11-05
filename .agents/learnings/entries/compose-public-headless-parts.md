---
id: compose-public-headless-parts
description: headless context의 prop bag을 직접 펼치거나 기반 브랜치의 Popover 동작 변경을 통합할 때 읽는다. 공개 부품에 있는 dismissal·focus 동작이 빠지는 위험과 rebase 후 확인 범위를 다룬다.
scope: ["packages/react-headless/**", "packages/react/**", "docs/registry/react/**"]
status: active
---

# Headless 동작은 공개 부품으로 조합한다

## 교훈과 다음 행동

- PopoverPrimitive.Positioner·Content처럼 공개 부품을 조합하고 필요한 속성은 props로 덮어쓴다. 기준 브랜치가 바뀌면 소비하는 headless 소스 diff와 Escape·바깥 클릭·focus 복귀 테스트를 확인한다. 비동기 layer 등록과 focus 복귀는 기존 waitForFocus 패턴을 참고한다.

## 발생 근거와 적용 조건

- Date Picker Week에서 usePopoverContext().positionerProps를 div에 펼쳤다. 기반 Popover가 useDismiss를 제거하고 DismissibleLayer와 FloatingFocusManager를 공개 부품으로 옮기자 타입 검사는 통과했으나 Escape로 닫히지 않아 week 테스트가 30초 timeout으로 실패했다.

## 변경 이력

- 2026-09-29: major rebase에서 AGENT_LEARNINGS.md 원문 commit `57d9448f8`의 교훈을 이관했다. 이관 과정에서 실행 재검증하지 않았다.
