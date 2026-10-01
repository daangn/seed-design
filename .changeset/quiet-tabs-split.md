---
"@seed-design/lynx-react-tabs": minor
"@seed-design/lynx-react": patch
---

Lynx Tabs를 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-tabs`를 추가합니다. React `@seed-design/react-tabs`와 같은 `Root`·`List`·`Trigger`·`Content`·`Indicator`·`Carousel`·`CarouselCamera` 파트로 선택 상태와 controlled 값, Trigger·Content 등록 순서, 비활성화, 접근성과 ref, 선택한 Trigger를 목록 안에 보이게 하는 스크롤(`scrollAlign`), Indicator 위치, native viewpager 동기화를 제공합니다. Context는 `TabsProvider`·`useTabsContext({ strict })`, `useTabsTriggerContext`, `useTabsCarouselContext`로 공개합니다. `@seed-design/lynx-react` Tabs·ChipTabs는 사용법과 렌더링 결과를 유지하며 이 패키지 위에 Recipe·Label·notification·Scale Feedback을 조립합니다.

`transitionsEnabled`는 모든 Trigger 측정값이 반영된 다음 업데이트부터 `true`가 되어, 첫 진입 때 Indicator가 측정 전 위치에서 미끄러지지 않습니다.
