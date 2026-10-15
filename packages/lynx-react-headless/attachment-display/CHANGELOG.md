# @seed-design/lynx-react-attachment-display

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 580d5eb: SEED 스타일 없이 원격 첨부 목록을 표시할 수 있는 `@seed-design/lynx-react-attachment-display`를 추가합니다.
  
  - `AttachmentDisplay.Root`·`Trigger`·`ItemImage`·`ItemBackdrop`·`ItemRemoveButton`·`Description`·`ErrorMessage`를 조합합니다.
  - `entries`·`defaultEntries`·`onEntriesChange`로 목록을 관리합니다.
  - `useAttachmentDisplayContext`의 `addEntries`·`updateEntryStatus`·`removeEntry`·`reorderEntry`로 항목과 업로드 상태를 갱신합니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
