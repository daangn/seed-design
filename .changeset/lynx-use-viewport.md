---
"@seed-design/lynx-react": minor
---

현재 LynxView의 크기를 반환하는 `useViewport`를 추가합니다. root를 측정하고 `onWindowResize`로 크기 변경을 따라가므로, 접히는 기기·회전·앱 안에 삽입된 화면에서도 실제 layout 크기를 씁니다.

- `BottomSheet`의 백분율 snap point와 `Select`·`Menu`의 `size="responsive"`가 기기 화면 크기(`SystemInfo`) 대신 `useViewport` 값을 기준으로 합니다. 전체 화면에서는 결과가 같습니다.
- `BottomSheet`는 더 이상 `lynx.__globalProps.screenHeight`를 읽지 않습니다. 크기를 직접 정하려면 `BottomSheet.Root`의 `screenHeight`·`screenWidth`를 넘기세요.
