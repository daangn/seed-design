---
"@seed-design/react-snackbar": patch
"@seed-design/react": patch
---

Snackbar가 표시된 상태에서 새 Snackbar를 create할 때의 동작을 정의하는 `strategy` 옵션을 추가합니다. 기본값은 `immediate`로, 새 Snackbar가 기존 Snackbar를 즉시 교체합니다.

- 기존 스낵바에 할당된 시간이 모두 지난 뒤 새 Snackbar가 표시되는 이전 버전의 기존 동작을 선호하는 경우 `SnackbarProvider` 또는 `useSnackbarAdapter` 옵션으로 `queued`를 사용할 수 있습니다.
- `immediate` 옵션을 모방하기 위해 `dismiss()` 후 `setTimeout(() => create(...), 0)`하던 workaround와 함께 사용해도 정상 동작하지만, 동작이 동일하므로 workaround는 제거하는 것을 권장합니다.
