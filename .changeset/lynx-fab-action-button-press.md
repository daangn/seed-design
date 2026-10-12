---
"@seed-design/lynx-react": patch
---

Lynx `ActionButton`·`FloatingActionButton`·`ContextualFloatingButton`의 기본 `accessibility-traits`가 버튼 상태를 올바르게 알리도록 수정합니다.

- 이전에는 `ActionButton`이 `disabled`·`loading` 상태에서도 `"button"`으로 안내됐습니다. 이제 이 상태에서는 `"disabled"`로 안내합니다.
- `FloatingActionButton`과 `ContextualFloatingButton`은 활성 상태에서 기본 trait가 없었습니다. 이제 `"button"`을 제공하고, 비활성 상태는 기존처럼 `"disabled"`로 안내합니다.
- 직접 지정한 `accessibility-traits`는 그대로 사용합니다.
