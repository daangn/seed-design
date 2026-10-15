# @seed-design/lynx-react-scale-feedback

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 8337f8e: 요소 전체 또는 자식 콘텐츠에 눌림 축소를 적용할 수 있는 `@seed-design/lynx-react-scale-feedback`을 제공합니다.
  
  - `ScaleFeedback`으로 자식을 감싸 요소 전체에 눌림 축소를 적용합니다.
  - `useScaleFeedback`의 `scaleFeedbackTriggerProps`와 `scaleFeedbackTargetProps`를 각각 눌림을 받는 요소와 축소할 요소에 적용해 콘텐츠만 축소할 수 있습니다.
  - `disabled` 또는 `GlobalProps.motion="reduced"`이면 축소하지 않습니다.

### Patch Changes

- Updated dependencies [7dae990]
- Updated dependencies [524ad2f]
- Updated dependencies [7dae990]
- Updated dependencies [20d639c]
- Updated dependencies [7dae990]
- Updated dependencies [4f1c681]
- Updated dependencies [f417a4f]
- Updated dependencies [f164f8b]
- Updated dependencies [7f51d06]
- Updated dependencies [3b4d190]
- Updated dependencies [d4a20aa]
- Updated dependencies [a5af36f]
- Updated dependencies [bb2513e]
- Updated dependencies [46ecb70]
- Updated dependencies [a1881c3]
- Updated dependencies [e5ebfb1]
- Updated dependencies [26bf8c3]
- Updated dependencies [eb01c01]
- Updated dependencies [39d5917]
- Updated dependencies [524ad2f]
- Updated dependencies [e056828]
- Updated dependencies [e056828]
- Updated dependencies [524ad2f]
- Updated dependencies [34e7691]
- Updated dependencies [524ad2f]
- Updated dependencies [7dae990]
- Updated dependencies [524ad2f]
- Updated dependencies [7dae990]
- Updated dependencies [b7cad68]
- Updated dependencies [a684488]
- Updated dependencies [ee36625]
- Updated dependencies [5769ae6]
- Updated dependencies [ac07387]
- Updated dependencies [524ad2f]
- Updated dependencies [7dae990]
- Updated dependencies [83b5ca4]
- Updated dependencies [f423482]
- Updated dependencies [7dae990]
- Updated dependencies [26fa233]
- Updated dependencies [7147073]
  - @seed-design/lynx-css@1.0.0
