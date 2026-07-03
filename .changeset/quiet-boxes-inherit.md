---
"@seed-design/css": patch
"@seed-design/react": patch
---

구형 iOS Safari(16.4 미만)에서 중첩된 `Box` 및 일부 컴포넌트가 상위 요소의 레이아웃 값을 잘못 상속하던 문제를 수정합니다.

- 값을 지정하지 않은 자식 `Box`가 상위의 `width`, `height`, `gap`, `margin` 등을 물려받아 의도와 다르게 렌더링되던 문제를 해결합니다. 모던 브라우저의 동작에는 변화가 없습니다.
- `SidePanel`, `BottomSheet`, `Skeleton`, `HelpBubble`에서도 동일한 상속 문제를 바로잡습니다.
- `bleed`를 지정한 요소가 구형 Safari에서도 정상 동작하도록 개선합니다.
