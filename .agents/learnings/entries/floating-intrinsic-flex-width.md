---
id: floating-intrinsic-flex-width
description: 내용 너비로 크기가 정해지는 floating·absolute 영역에 flex 컬럼을 넣을 때 읽는다. flex-basis가 shrink-to-fit 부모의 intrinsic 너비를 보장하지 않는 경우와 브라우저 측정 방법을 다룬다.
scope: ["packages/qvism-preset/src/recipes/**", "docs/registry/react/ui/date-picker.tsx"]
status: active
---

# 내용 기준 popover 너비는 flex-basis만으로 보장되지 않는다

## 교훈과 다음 행동

- flex item에 intrinsic 크기에 반영되는 minWidth 또는 width를 함께 준다. 다른 recipe와 CSS 순서가 충돌하지 않는 속성을 고르고 브라우저 getBoundingClientRect().width로 검증한다.

## 발생 근거와 적용 조건

- Date Picker Week의 연·월 Wheel에서 flex:0 0 120px·96px만 유지하자 width:max-content가 intrinsic 너비를 정해 popover가 216px 대신 168px로 좁아졌다. date-picker recipe의 yearColumn·monthColumn에 minWidth:120px·96px를 추가했다. 레이아웃이 없는 단위 테스트는 통과했다.

## 변경 이력

- 2026-09-29: major rebase에서 AGENT_LEARNINGS.md 원문 commit `57d9448f8`의 교훈을 이관했다. 이관 과정에서 실행 재검증하지 않았다.
