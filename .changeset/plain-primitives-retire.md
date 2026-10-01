---
"@seed-design/react": major
---

(BREAKING CHANGE: `@seed-design/react/primitive` import를 `@seed-design/react` 또는 독립 headless 패키지로 옮겨야 합니다. 이 경로를 import하는 `ui:attachment-display-field`, `ui:attachment-display-field-reorderable`, `ui:attachment-field`, `ui:attachment-field-reorderable`, `ui:chip`, `ui:list`, `ui:side-navigation` snippet과 `block:side-navigation-02`도 다시 설치해야 합니다.) `@seed-design/react/primitive` 경로를 제거하고, 사용자에게 필요한 API를 `@seed-design/react`에서 제공합니다.

`@seed-design/react/primitive`는 SEED 컴포넌트가 내부에서 사용하는 headless 패키지를 그대로 다시 export하던 경로입니다.

- `@seed-design/react`에 다음 API를 추가합니다.
  - `Switch.Root.Primitive`, `RadioGroupField.Root.Primitive`: SEED 레이아웃 스타일 없이 선택·키보드·폼 동작을 제공합니다. 기존 `Checkbox.Root.Primitive`, `RadioGroup.Item.Primitive`와 함께 쓸 수 있도록 `Checkbox.RootPrimitiveProps`, `RadioGroup.ItemPrimitiveProps`, `Switch.RootPrimitiveProps`, `RadioGroupField.RootPrimitiveProps` 타입도 추가합니다.
  - `List.CheckItem`, `List.RadioItem`, `List.SwitchItem`, `List.RadioRoot`와 각 Props 타입
  - `useAttachmentDisplayContext`, `useAttachmentInputContext`, `useSideNavigationContext`와 `AttachmentDisplayContextValue`, `AttachmentInputContextValue`, `SideNavigationContextValue` 타입
  - `AttachmentDisplayItemEntry`, `AttachmentDisplayItemStatusDetails`, `AttachmentInputFileEntry`, `AttachmentInputFileStatusDetails` 타입
  - `usePagination`, `useTablePagination`과 `PaginationChangeDetails`, `PaginationChangeReason`, `PaginationVisibleItemCount`, `TablePaginationChangeDetails`, `TablePaginationChangeReason`, `TablePaginationValue`, `UsePaginationProps`, `UseTablePaginationProps` 타입

**마이그레이션**

| 기존 `@seed-design/react/primitive` export | 변경할 `@seed-design/react` export |
| --- | --- |
| `Checkbox.Root` / `Checkbox.RootProps` | `Checkbox.Root.Primitive` / `Checkbox.RootPrimitiveProps` |
| `RadioGroup.Item` / `RadioGroup.ItemProps` | `RadioGroup.Item.Primitive` / `RadioGroup.ItemPrimitiveProps` |
| `RadioGroup.Root` / `RadioGroup.RootProps` | `RadioGroupField.Root.Primitive` / `RadioGroupField.RootPrimitiveProps`. `ListRadioItem`을 감싸는 용도였다면 `List.RadioRoot` / `List.RadioRootProps` |
| `Switch.Root` / `Switch.RootProps` | `Switch.Root.Primitive` / `Switch.RootPrimitiveProps` |
| `Checkbox.HiddenInput`, `RadioGroup.ItemHiddenInput`, `Switch.HiddenInput` | 같은 이름 |
| `DisplayItemEntry`, `DisplayItemStatusDetails` | `AttachmentDisplayItemEntry`, `AttachmentDisplayItemStatusDetails` |
| `FileEntry`, `FileStatusDetails` | `AttachmentInputFileEntry`, `AttachmentInputFileStatusDetails` |
| `useFileUploadContext` / `UseFileUploadContext`, `UseFileUploadReturn` | `useAttachmentInputContext` / `AttachmentInputContextValue` |
| `useAttachmentDisplayContext` / `UseAttachmentDisplayContext`, `UseAttachmentDisplayReturn` | `useAttachmentDisplayContext` / `AttachmentDisplayContextValue` |
| `useSideNavigationContext` / `UseSideNavigationContext` | `useSideNavigationContext` / `SideNavigationContextValue` |
| `useSnackbarContext`, `UseSnackbarContext`, `CreateSnackbarOptions`, `pullToRefreshPreventPull`, `tabsCarouselPreventDrag` | 같은 이름 |

표에 없는 export는 이름을 유지한 채 원래 headless 패키지(`@seed-design/react-dialog`, `@seed-design/react-popover`, `@seed-design/react-tabs` 등)를 의존성에 추가하고 import 경로를 바꾸세요. `@seed-design/react`의 `Dialog`, `Tabs`, `Slider`처럼 이름이 같은 export는 SEED 스타일이 적용된 다른 컴포넌트이므로, import 경로만 `@seed-design/react`로 바꾸지 마세요. Avatar는 `@seed-design/react-image`로 옮기세요. 자세한 내용은 [SEED React 3 업그레이드 가이드](https://seed-design.io/react/updates/upgrade/v3)를 참고하세요.
