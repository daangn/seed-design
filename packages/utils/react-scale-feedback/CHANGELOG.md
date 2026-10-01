# @seed-design/react-scale-feedback

## 2.0.0

### Major Changes

- 19ecbd6: 누르는 동안 배경은 그대로 두고 콘텐츠만 줄어들게 하는 `ContentScale` 컴포넌트를 추가합니다.

### Patch Changes

- Updated dependencies [19ecbd6]
- Updated dependencies [19ecbd6]
- Updated dependencies [d3edadf]
- Updated dependencies [19ecbd6]
- Updated dependencies [5e34f78]
- Updated dependencies [fa3eb46]
- Updated dependencies [19ecbd6]
- Updated dependencies [8c70df1]
- Updated dependencies [66c3bd9]
- Updated dependencies [78f0bc1]
- Updated dependencies [ebdc295]
- Updated dependencies [19ecbd6]
- Updated dependencies [66c3bd9]
- Updated dependencies [19ecbd6]
  - @seed-design/css@3.0.0

## 1.0.0

### Major Changes

- 7027b5f: Scale Feedback에 필요한 React 유틸리티를 `@seed-design/react-scale-feedback` 패키지로 분리합니다.

  - `@seed-design/react`에 의존하지 않는 패키지에서도 Scale Feedback을 적용할 수 있습니다.
  - 새 패키지에서 `useScaleFeedback`과 `ScaleFeedback`을 가져올 수 있습니다.
  - `@seed-design/react`의 기존 export는 그대로 유지되므로 코드를 고칠 필요가 없습니다.
