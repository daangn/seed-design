---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: 설치한 항목만 남겨 `npx @seed-design/cli@latest add ui:switch ui:select-box ui:attachment-field-reorderable ui:attachment-display-field-reorderable ui:callout ui:page-banner ui:dialog ui:alert-dialog ui:list ui:text-field --on-diff backup`으로 Registry 컴포넌트를 다시 설치해야 합니다. `Switchmark`의 상태 prop을 `Switch.Root`로 옮기고, 로컬 `attachment-sortable` helper를 `@seed-design/lynx-react-sortable`로 변경하며, Registry `TextField`의 `nativeInsertionMaxLength` 지정을 제거해야 합니다.) SEED Lynx 1의 Registry 컴포넌트 사용법을 변경합니다. 패키지를 올려도 프로젝트에 복사한 컴포넌트는 자동으로 갱신되지 않습니다.

- `Switchmark`는 `Switch.Root` 안에서 사용하고, `checked`·`defaultChecked`·`onCheckedChange`·`disabled`는 `Switch.Root`로 옮깁니다. Registry `RadioSelectBoxRoot`의 `className`·`style`은 안쪽 grid가 아니라 바깥 Field에 적용하므로 기존 grid 스타일을 확인합니다.
- 로컬 `attachment-sortable`의 `HorizontalReorderList`·`HorizontalReorderItem`을 직접 사용했다면 `@seed-design/lynx-react-sortable`의 `Sortable.Root`·`Sortable.Item`으로 변경합니다. 재정렬 첨부 컴포넌트는 이동·삭제·재시도 접근성 action을 제공합니다.
- `ActionableCallout`·`ActionablePageBanner`는 handler가 없어도 button 접근성과 눌림 효과를 제공합니다. 정보 표시용이면 `Callout`·`PageBanner`를 사용합니다.
- `DialogAction`·`AlertDialogAction`은 `disabled`·`loading`이면 닫힘을 요청하지 않습니다. `ListDivider`는 직접 지정한 `accessibility-element` 값을 유지합니다.
- Registry `TextField`에서 `nativeInsertionMaxLength`를 직접 지정한 코드는 제거합니다. 이 값은 컴포넌트가 내부에서 관리합니다.
