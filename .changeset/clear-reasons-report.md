---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `BottomSheet.Root`와 `MenuSheet.Root` ref의 `open()`·`close()` 호출에 의존하던 callback 작업은 앱 코드에서 직접 실행해야 합니다. 제어 상태에서는 ref 호출 대신 `open` 값을 갱신해야 합니다.)

`BottomSheet.Root`와 `MenuSheet.Root`의 `onOpenChange`를 사용자 동작에 따른 열림 변경 요청으로 구분합니다.

- 이전에는 열림 값만 전달했지만, 이제 두 번째 인자의 `details.reason`으로 `trigger`·`closeButton`·`interactOutside`·`drag` 사유도 전달합니다.
- 이전에는 ref 호출로 열림 상태를 바꾸면 callback이 실행됐지만, 이제 ref 호출과 `open` prop 변경은 `onOpenChange`를 호출하지 않습니다.
- 제어 상태에서는 사용자 동작이 callback으로 변경을 요청하고, 부모가 `open`을 갱신해야 시트 상태가 바뀝니다. 사유를 사용하지 않는 한 인자 callback은 그대로 사용할 수 있습니다.
