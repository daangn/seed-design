---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `BottomSheet.Root`와 `MenuSheet.Root` ref의 `open()`·`close()` 호출에 의존하던 callback 작업은 앱 코드에서 직접 실행해야 합니다. 제어 상태에서는 ref 호출 대신 `open` 값을 갱신해야 합니다.) `onOpenChange`가 `trigger`·`closeButton`·`interactOutside`·`drag` 사유를 전달합니다. 사유가 필요한 callback은 두 번째 인자의 `details.reason`을 사용할 수 있으며, 사유를 사용하지 않는 한 인자 callback은 그대로 사용할 수 있습니다. `Root` ref 호출과 `open` prop 변경은 `onOpenChange`를 호출하지 않습니다.
