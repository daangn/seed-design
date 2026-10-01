---
id: lynx-ui-sheet-show-change-sources
description: "`@lynx-js/lynx-ui-sheet` 기반 Lynx BottomSheet·MenuSheet의 `onOpenChange`에 reason을 붙이거나, ref 호출·controlled `open`·Backdrop 탭을 사용자 동작과 구분해야 하거나, 닫은 뒤 `onOpenChange(false)`가 한 번 더 오거나 이전 동작의 reason이 다음 drag에 섞일 때 읽는다. 엔진이 모든 열림 변경을 하나의 `onShowChange`로 보내는 경로와 호출 시점, reason을 남기고 지우는 기준, ref 변경을 알리지 않는 방법을 다룬다. lynx-ui-dialog 기반 Dialog·AlertDialog나 presence 테스트 frame 문제에는 적용하지 않는다."
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/src/components/**"]
status: active
related: ["lynx-drag-gesture-cdp", "lynx-headless-tree-parity"]
verified_at: "2026-10-01"
---

# lynx-ui-sheet의 `onShowChange`는 원인을 구분하지 않으므로 reason은 엔진 호출 동안에만 남긴다

## 교훈과 다음 행동

- `SheetRoot`는 ref의 `open`·`close`·`snapTo`·`expand`·`collapse`, Backdrop 탭, drag 닫힘·되살림을 모두 같은 `onShowChange`로 알린다. 원인을 받는 인자는 없다.
  - ref 메서드는 같은 호출 안에서 `handleShowChange`를 동기로 부른다. 값이 현재 `show`와 같으면 알리지 않는다.
  - 닫힘은 경로와 관계없이 presence가 `Leaving`이 될 때 `runOnBackground(onBeforeDismiss)`로 `onShowChange(false)`를 한 번 더 부른다. 이미 닫힌 값으로 렌더됐으면 걸러지지만, controlled `open`이 아직 `true`면 그대로 전달된다.
  - `SheetBackdrop`의 `clickToClose`는 `onShowChange(false)`를 먼저 부르고 `onClick`을 나중에 부른다. 그 사이에 reason을 끼울 수 없다.
- 사용자 동작의 reason은 엔진 메서드를 부르기 직전에 남기고 `finally`에서 지운다. 호출이 끝난 뒤까지 남겨 두면 값이 바뀌지 않은 호출(열린 상태의 Trigger 탭)의 reason이 다음 drag 닫힘에 붙는다.
- ref 호출을 알리지 않으려면 공개 ref를 감싼 handle에서 요청한 열림 값을 기록한다. 같은 값의 `onShowChange`(뒤따르는 `Leaving` 알림 포함)는 무시하고, 다른 값이 오거나 사용자 동작이 시작되면 기록을 지운다.
- Backdrop은 엔진에 `clickToClose={false}`를 넘기고, `onClick`에서 reason과 함께 닫는다.
- controlled `open`에서는 사용자 동작이 `onOpenChange`만 호출하고 엔진 메서드를 부르지 않는다. 엔진의 `close`는 `show`와 관계없이 닫힘 애니메이션을 큐에 넣으므로, 앱이 `open`을 바꾸지 않으면 시트가 닫혔다가 unmount 뒤 `show`를 따라 다시 열린다(소스 추론, 기기 미확인).
- 구현 예(Lynx 1.0 작업 브랜치 `refactor-lynx-components` 기준): `packages/lynx-react-headless/bottom-sheet/src/BottomSheet.tsx`의 `BottomSheetRoot`(`setOpen`, `handleShowChange`), `BottomSheetBackdrop`.

## 발생 근거와 적용 조건

- 근거 소스: `@lynx-js/lynx-ui-sheet` 3.133.1의 `src/SheetRoot/index.tsx`(`handleShowChange`, imperative handle), `src/SheetContent/index.tsx`(`handleBeforeDismiss`, `handleResurrected`), `src/hooks/useSheetPresence.ts`(`Leaving` 전이), `src/SheetBackdrop/index.tsx`(`handleClick`).
- DES-2634 이전 SwipeableMenuSheet는 reason을 ref에 남겨 두고 다음 `onShowChange`에서 소비했다. lynx-ui-sheet처럼 값이 같으면 알리지 않는 mock 엔진으로 재현했을 때, 열린 상태에서 Trigger를 탭한 뒤 drag로 닫으면 `"trigger"`가 보고됐다. ref의 `open()`·`close()`는 `"drag"`로 보고됐다.
- 수정 뒤 headless `BottomSheet.test.tsx`가 위 경우와 ref 닫힘 뒤의 `Leaving` 알림을 확인한다. iOS 시뮬레이터 PlayLynx(SDK 1.4.0) production bundle에서도 확인했다. `lynx/menu-sheet/open-change-reason`의 Item 탭·닫기 버튼·Backdrop·drag reason, `lynx/bottom-sheet/controlled`의 Backdrop·drag 닫힘과 재열림, `lynx/bottom-sheet/snap-points`의 비제어 ref `snapTo`·`close`가 변경 전 bundle과 같았다.
- 적용 조건: 엔진이 lynx-ui-sheet 3.133.x이고 `onShowChange`에 원인 인자가 없을 때. 엔진이 원인을 제공하게 되면 이 우회를 다시 검토한다.

## 변경 이력

- 2026-10-01: DES-2634 MenuSheet reason 분리에서 기록했다.
