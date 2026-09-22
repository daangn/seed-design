---
"@seed-design/css": major
"@seed-design/react": major
---

(BREAKING CHANGE: 프로젝트에 있는 `ui:alert-dialog`와 `ui:dialog` snippet을 다시 설치해야 합니다. `@seed-design/react`의 `Dialog`·`ContentDialog`나 `@seed-design/css`의 dialog recipe·class name·CSS 변수를 직접 사용한다면 새 이름으로 옮겨야 하며, 대부분 에러로 발견되지 않습니다.) `@seed-design/react`와 `@seed-design/css`에서 Alert Dialog와 Dialog의 이름을 snippet 이름에 맞춥니다.

2.x에서는 `Dialog`라는 이름이 `@seed-design/react`와 snippet에서 서로 다른 컴포넌트를 가리켰습니다. `@seed-design/react`에서는 `Dialog`가 Alert Dialog를, `ContentDialog`가 Dialog를 가리켰고, snippet은 Alert Dialog를 `ui:alert-dialog`(`AlertDialogRoot` 등)로, Dialog를 `ui:dialog`(`DialogRoot` 등)로 제공했습니다.

- `@seed-design/react`의 `Dialog`를 `AlertDialog`로, `ContentDialog`를 `Dialog`로 변경합니다. `DialogRoot`, `DialogRootProps` 같은 개별 export도 같은 규칙으로 바뀝니다.
- `@seed-design/css/recipes/dialog`를 `@seed-design/css/recipes/alert-dialog`로, `@seed-design/css/recipes/content-dialog`를 `@seed-design/css/recipes/dialog`로 변경합니다. `dialog`, `dialogVariantMap` 같은 recipe export와 recipe CSS 파일(`recipes/dialog.css` 등)도 같은 규칙으로 바뀝니다.
- class name `.seed-dialog__*`를 `.seed-alert-dialog__*`로, `.seed-content-dialog__*`를 `.seed-dialog__*`로 변경합니다.
- CSS 변수 `--content-dialog-default-width`, `--content-dialog-default-max-width`, `--content-dialog-size-width`를 각각 `--dialog-default-width`, `--dialog-default-max-width`, `--dialog-size-width`로 변경합니다. 두 컴포넌트가 함께 사용하는 `--dialog-z-index`는 바뀌지 않습니다.
- `AlertDialog.Root`의 기본값을 `role="alertdialog"`, `closeOnInteractOutside={false}`로 변경합니다. 2.x의 `Dialog.Root`는 두 값을 넘기지 않으면 `role="dialog"`로 렌더링되고 바깥을 누르면 닫혔습니다. `ui:alert-dialog` snippet의 `AlertDialogRoot`는 2.x에서도 두 값을 직접 넘기고 있었으므로, snippet으로 사용하는 Alert Dialog의 동작은 바뀌지 않습니다.
- snippet이 export하는 이름(`AlertDialogRoot`, `DialogRoot` 등)은 바뀌지 않습니다.

`@seed-design/react`의 `Dialog`, `@seed-design/css/recipes/dialog`, `.seed-dialog__*`는 3.0에도 같은 이름으로 남아 Alert Dialog가 아닌 Dialog를 가리킵니다. 새 `Dialog`는 2.x `Dialog`의 하위 컴포넌트를 모두 제공하므로, 옮기지 않은 Alert Dialog 코드도 타입 에러 없이 Dialog로 렌더링됩니다. 옮길 때 다음을 지켜 주세요. 사용처를 찾는 방법과 작업 후 확인 목록은 [SEED React 3 업그레이드 가이드](https://seed-design.io/react/updates/upgrade/v3)에 있습니다.

- snippet을 import하는 코드는 수정하지 않습니다. `@seed-design/react`의 이름 변경을 `DialogRoot` 같은 snippet의 이름에 적용하면 Dialog가 Alert Dialog로 바뀝니다.
- `ui:alert-dialog` snippet이 있다면 반드시 다시 설치합니다. 2.x snippet은 `@seed-design/react`의 `Dialog`를 import하므로, 다시 설치하지 않으면 snippet의 Alert Dialog가 에러 없이 Dialog로 렌더링됩니다.
- `@seed-design/react`, recipe, class name을 직접 사용한다면, 바꾸기 전에 사용처마다 2.x 이름으로 Alert Dialog인지 Dialog인지 분류합니다. 일괄 치환한다면 Alert Dialog(`Dialog` → `AlertDialog`)를 모두 옮긴 뒤 Dialog(`ContentDialog` → `Dialog`)를 옮깁니다. 순서를 바꾸면 `ContentDialog`에서 옮긴 `Dialog`까지 다시 `AlertDialog`로 바뀝니다.
- 이름 변경은 2.x 코드에 한 번만 적용합니다. 일부를 이미 옮긴 코드에서는 남아 있는 `Dialog`가 어느 쪽인지 이름만으로 구분할 수 없습니다.
- `@seed-design/react`의 `Dialog.Root`에 `role`이나 `closeOnInteractOutside`를 넘기지 않았다면, `AlertDialog.Root`로 옮긴 뒤 `role`이 `"alertdialog"`가 되고 바깥을 눌러도 닫히지 않습니다. 2.x의 동작을 유지해야 한다면 두 값을 명시합니다.
