---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: 설치한 항목만 남겨 `npx @seed-design/cli@latest add ui:switch ui:select-box ui:attachment-field-reorderable ui:attachment-display-field-reorderable ui:callout ui:page-banner ui:dialog ui:alert-dialog ui:list ui:text-field --on-diff backup`으로 Registry 컴포넌트를 다시 설치해야 합니다. `Switchmark`의 상태 prop을 `Switch.Root`로 옮기고, 로컬 `attachment-sortable` helper를 `@seed-design/lynx-react-sortable`로 변경하며, Registry `TextField`의 `nativeInsertionMaxLength` 지정을 제거해야 합니다. `RadioSelectBoxRoot`의 `className`·`style`로 grid를 꾸몄다면 안쪽 grid 스타일을 다시 적용해야 합니다.)

패키지 업그레이드만으로는 갱신되지 않는 Registry 컴포넌트를 SEED Lynx 1의 API와 접근성 동작에 맞춰 변경합니다.

- `Switchmark`는 상태를 가진 독립 Root에서 `Switch.Root` 안의 `Control`·`Thumb` 조합으로 바뀝니다. `RadioSelectBoxRoot`는 Field와 안쪽 grid를 분리하며, `className`·`style`은 이제 grid가 아니라 바깥 Field에 적용합니다.
- 재정렬 첨부 컴포넌트는 로컬 `HorizontalReorderList`·`HorizontalReorderItem` 대신 `Sortable.Root`·`Sortable.Item`을 사용하고, 화면 읽기 프로그램에 이동·삭제·재시도 action을 제공합니다.
- `ActionableCallout`·`ActionablePageBanner`는 이전과 달리 handler가 없어도 button 접근성과 눌림 효과를 제공합니다. `DialogAction`·`AlertDialogAction`은 `disabled`·`loading`일 때 닫힘을 요청하지 않으며, `ListDivider`는 직접 지정한 `accessibility-element` 값을 더 이상 덮어쓰지 않습니다.
- Registry `TextField`는 내부에서 관리하는 `nativeInsertionMaxLength`를 공개 prop에서 제외합니다.
