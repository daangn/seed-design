---
"@seed-design/react": minor
"@seed-design/css": minor
---

`SwipeableMenuSheet` 컴포넌트를 추가하고, 기존 `MenuSheet` 관련 API를 deprecate합니다.

**`SwipeableMenuSheet` 추가**

- Drawer 기반의 `SwipeableMenuSheet` 관련 컴포넌트를 추가합니다.
- 전체 영역을 스와이프하여 시트를 닫을 수 있으며, 해당 동작의 힌트로 상단에 드래그 핸들이 표시됩니다.
- `MenuSheet`에서는 항상 표시되었던 닫기 버튼을 기본적으로 UI에 표시하지 않습니다. `showCloseButton` prop을 통해 닫기 버튼의 노출 여부를 제어할 수 있습니다.

**`MenuSheet` 관련 컴포넌트 및 API Deprecate**

- Dialog 기반의 `MenuSheet` 관련 컴포넌트 및 API를 deprecate합니다. 신규로 Menu Sheet 사용이 필요한 경우 `SwipeableMenuSheet`를 사용합니다.
- `open`/`defaultOpen`/`onOpenChange`등 기본적인 `MenuSheet`의 API는 `SwipeableMenuSheet`에서 동일하게 유지됩니다.
