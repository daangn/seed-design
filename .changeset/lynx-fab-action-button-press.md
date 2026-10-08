---
"@seed-design/lynx-react": patch
---

Lynx `ActionButton`·`FloatingActionButton`·`ContextualFloatingButton`이 상태에 맞는 기본 `accessibility-traits`를 알리도록 수정합니다.

- `ActionButton`은 `disabled`·`loading` 상태를 `"disabled"`로 알립니다.
- `FloatingActionButton`과 `ContextualFloatingButton`은 활성 상태를 `"button"`으로 알리고, 비활성 상태를 `"disabled"`로 알립니다.
- 직접 지정한 `accessibility-traits`는 그대로 사용합니다.
