# @seed-design/react-attachment-display

## 1.0.3

### Patch Changes

- f2b7ec5: TypeScript 5.0 이하나 `@types/react` 18.2.7 이하에서 `Snackbar.Renderer`, `AttachmentDisplay.Context`, `AttachmentInput.Context`를 JSX 컴포넌트로 쓸 수 없다는 TS2786 오류가 나던 문제를 수정합니다.

## 1.0.2

### Patch Changes

- 76baa4b: (사용자 변경사항 없음) 내부 의존성을 호환되는 버전으로 갱신합니다.

## 1.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-primitive@2.0.1

## 1.0.0

### Major Changes

- 555525a: Attachment Field 관련 컴포넌트를 추가합니다.

  - Attachment Field: 파일을 선택하거나 드래그 앤 드롭으로 직접 업로드할 때 사용합니다.
  - Attachment Display Field: 외부 소스에서 URL로 제공된 미디어를 표시·관리할 때 사용합니다.

### Patch Changes

- Updated dependencies [ec33023]
  - @seed-design/react-primitive@2.0.0
