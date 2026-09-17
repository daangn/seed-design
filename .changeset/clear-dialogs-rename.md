---
"@seed-design/css": major
"@seed-design/react": major
---

(BREAKING CHANGE: `Dialog`를 `AlertDialog`로 먼저 바꾼 뒤 `ContentDialog`를 `Dialog`로 바꾸고, Registry 컴포넌트 `ui:alert-dialog`와 `ui:dialog`를 다시 설치해야 합니다.) Alert Dialog와 Dialog의 이름을 Registry 컴포넌트 이름에 맞춥니다.

- `@seed-design/react`의 `Dialog`를 `AlertDialog`로, `ContentDialog`를 `Dialog`로 변경합니다. `DialogRoot` 같은 개별 export와 Props 타입도 같은 규칙으로 바뀝니다.
- `@seed-design/css/recipes/dialog`를 `@seed-design/css/recipes/alert-dialog`로, `@seed-design/css/recipes/content-dialog`를 `@seed-design/css/recipes/dialog`로 변경합니다. `dialog`, `dialogVariantMap` 같은 recipe export도 같은 규칙으로 바뀝니다.
- class name `.seed-dialog__*`를 `.seed-alert-dialog__*`로, `.seed-content-dialog__*`를 `.seed-dialog__*`로 변경합니다.
- CSS 변수 `--content-dialog-default-width`, `--content-dialog-default-max-width`, `--content-dialog-size-width`를 `--dialog-*`로 변경합니다.
- `AlertDialog.Root`의 `role` 기본값을 `"alertdialog"`로, `closeOnInteractOutside` 기본값을 `false`로 변경합니다. Registry 컴포넌트 `ui:alert-dialog`가 넣어 주던 값과 같습니다.
- `Dialog`, `recipes/dialog`, `.seed-dialog__*`는 이름이 그대로 남고 가리키는 대상만 바뀌므로, 에러 없이 스타일과 동작이 달라질 수 있습니다. 반드시 위 순서대로 교체해 주세요.
