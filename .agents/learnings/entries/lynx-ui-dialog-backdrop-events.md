---
id: lynx-ui-dialog-backdrop-events
description: "`@lynx-js/lynx-ui-dialog` 기반 Lynx Dialog·AlertDialog(또는 `@seed-design/lynx-react-dialog` Headless)의 Backdrop 탭을 관찰·문서화하거나, `clickToClose={false}`인 Backdrop의 `onClick`이 호출되지 않거나, `container` 모드에서 Backdrop이 탭을 받는지(`event-through`) 판단할 때 읽는다. lynx-ui Backdrop이 `onClick`을 부르는 조건, Backdrop이 스스로 넣는 `event-through`, 기기에서 Backdrop 탭 전달을 판정하는 대조 방법을 다룬다. lynx-ui-sheet 기반 BottomSheet나 OverlayView를 직접 쓰는 Menu·Select에는 적용하지 않는다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/registry/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-ui-presence-test-frames", "playlynx-simulator-overlay-check"]
---

# lynx-ui Dialog Backdrop의 onClick은 닫힐 때만 호출된다

## 교훈과 다음 행동

- lynx-ui `DialogBackdrop`의 `onClick`은 탭이 Dialog를 닫을 때만 호출된다. `clickToClose`가 `false`이거나 presence가 busy면 `onShowChange`·`onClick` 모두 부르지 않는다 → 비닫힘 Backdrop(AlertDialog 기본값)에서 "`onClick`으로 탭을 관찰한다"고 문서화하지 않고, 탭 관찰 예제에 `onClick` 로그를 두지 않는다.
- 같은 Backdrop은 자기 `<view>`에 `event-through={false}`를 넣는다. `container` 모드에서 레이어 `<view>`가 `event-through: true`여도 Backdrop은 탭을 받는다(기기 DOM 확인). 모달 Dialog에 `dialogViewProps={{ "event-through": false }}`를 추가로 넣을 필요는 없다. 실제 터치 결과는 아래 미확인 범위를 본다.
- 기기에서 "Backdrop 탭으로 닫히지 않음"을 판정할 때는 같은 좌표·같은 입력으로 기본 `clickToClose`인 Dialog 예제(`lynx/dialog/preview`)가 닫히는지 먼저 대조한다. 닫히지 않은 결과만으로는 입력 미전달과 구분할 수 없다.

## 발생 근거와 적용 조건

- 근거: `@lynx-js/lynx-ui-dialog` 3.133.1 `src/Dialog.tsx`의 `DialogBackdrop.handleClick`이 `if (!clickToClose || busy) return` 뒤에 `onShowChange(false)`·`onClick()`을 부른다. 같은 컴포넌트가 `event-through={false}`를 `dialogBackdropProps`보다 먼저 펼친다.
- 관찰(DES-2621, iPhone iOS 26.6 PlayLynx, Lynx SDK 1.4.0, agent-lynx 0.14.2): Headless 소비 화면의 `clickToClose={false}` Backdrop에 `onClick` 로그를 두고 `Input.emulateTouchFromMouseEvent`로 Backdrop을 눌렀을 때 로그가 남지 않았다. 같은 좌표·입력으로 `lynx/dialog/preview`는 닫혔다.
- `lynx/alert-dialog/portalled`(`container="window"`)의 DOM에서 `<overlay>` 아래 Positioner는 `event-through="true"`, Backdrop·Content는 `event-through="false"`였다.
- 미확인: overlay 모드 Backdrop의 실제 터치 결과. 해당 Card가 기기 전면에 있지 않아 overlay 화면을 캡처하지 못했고, CDP 입력은 overlay 레이어에 전달되지 않는다(`playlynx-simulator-overlay-check`).

## 변경 이력

- 2026-10-02: DES-2621 AlertDialog Headless 재사용 작업의 소스 확인과 iPhone PlayLynx 관찰로 작성했다.
