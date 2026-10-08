---
id: lynx-go-keyboard-navbar-event
description: Android Lynx Go(`com.funcs.io.lynx.go`)에서 KeyboardAvoidingScrollView처럼 `keyboardstatuschanged`를 쓰는 Lynx 컴포넌트를 검증하다가, 키보드를 열기 전이나 닫은 뒤에도 Footer가 화면 아래에서 떠 있거나 이벤트가 `"off"` 대신 `["on", 48]`처럼 올 때 읽는다. 3버튼 내비게이션 바가 LynxView 아래쪽을 가린 높이가 키보드 이벤트로 오는 조건, Footer 위치를 내비게이션 바 상단과 비교해 결함 여부를 가리는 판정과 증거 수집 방법을 다룬다. iOS host와 실제 키보드 높이 자체의 오차에는 적용하지 않는다.
scope: ["packages/lynx-react-headless/keyboard-avoiding-scroll-view/**", "docs/examples/lynx/keyboard-avoiding-scroll-view/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-go-android-real-touch", "lynx-device-cdp-geometry", "playlynx-ios-soft-keyboard"]
verified_at: "2026-10-06"
---

# Lynx Go는 내비게이션 바가 가린 높이를 키보드 이벤트로 보낸다

## 교훈과 다음 행동

- Lynx Go는 LynxView를 3버튼 내비게이션 바 아래까지 그린다. 키보드를 열기 전과 닫은 뒤의 `keyboardstatuschanged`는 `"off"` 대신 `["on", 48]`처럼 바가 가린 높이로 온다. KeyboardAvoidingScrollView Footer는 이 높이만큼 올라가 바 바로 위에 붙는다 → Footer가 떠 보여도 결함으로 판정하지 않는다.
- 이 이벤트는 화면 진입 뒤 늦게 온다. JS에서 `keyboardstatuschanged` listener를 처음 붙이면 `LynxSetModule.switchKeyBoardDetect(true)`로 감지가 시작되고, 감지용 window의 첫 layout에서야 초기 상태를 보내기 때문이다(`js_libraries/lynx-core/src/modules/event/eventEmitter.ts`, `KeyboardEvent.startInMain`). 첫 화면은 그보다 먼저 그려지므로 Footer가 바 아래에 보였다가 올라간다 → 처음 구독한 뒤 짧게(KeyboardAvoidingScrollView는 100ms) 기다리는 동안 Footer를 숨기고, focus 전 이동은 transition 없이 놓는다.
- 판정: 내비게이션 바 상단은 `adb shell dumpsys window`의 `type=navigationBars frame=[…]` top이다. Footer bottom(`boundingClientRect`, `relativeTo: "screen"`, `androidEnableTransformProps: true`)에 dp 배율을 곱한 값이 이 top과 같으면 정상이다. 키보드가 열렸을 때는 page root bottom − 이벤트 height가 키보드 상단이다.
- 이벤트 기록은 `agent-lynx evaluate`로 `lynx.getJSModule("GlobalEventEmitter").addListener("keyboardstatuschanged", (status, height) => …)`를 걸어 전역 배열에 모은다. 컴포넌트가 먼저 구독하면 화면 진입 때 온 이벤트는 기록되지 않는다 → 진입 상태는 Footer 좌표와 `adb logcat`의 `showSoftInput` 유무로 판단한다.
- 키보드는 Lynx view 밖에 그려지므로 화면 증거는 `adb shell screencap`이나 `adb shell screenrecord`로 받는다. focus는 `adb shell input tap`(실제 터치)으로 열고, 키보드가 열린 동안의 `KEYCODE_BACK`으로 닫는다. 키보드가 닫힌 상태의 `KEYCODE_BACK`은 Card를 닫는다(`lynx-go-android-real-touch`).

## 발생 근거와 적용 조건

- 2026-10-06, KeyboardAvoidingScrollView Footer 추가 작업: Galaxy SM-F971N, Lynx Go, 3버튼 내비게이션(`settings get secure navigation_mode` = 0), `examples/lynx-spa` dev bundle의 `lynx/keyboard-avoiding-scroll-view/footer` 예제.
  - 내비게이션 바는 `frame=[0,1846][1248,1972]`(126px = 48dp, 배율 2.625)였다. page root bottom은 751.24dp(1972px)로 화면 끝까지 이어졌고, 화면 컨테이너의 `paddingBottom: safeAreaInsetBottom`은 0이었다(Root bottom = page root bottom).
  - 키보드를 연 적 없는 진입 직후(logcat에 `showSoftInput` 없음)에도 Footer는 626.29–703.24dp였다. 703.24dp는 1846px로 바 상단과 같다. 녹화 프레임에서도 Footer 아래 끝이 바 바로 위에 붙었다.
  - focus는 `["on", 338]`, Footer bottom 413.33dp(751.24 − 338 = 413.24)였다. `KEYCODE_BACK`으로 닫은 2회와 다른 곳 탭(blur)으로 닫은 경우를 포함한 닫힘 11회 모두 `["on", 48]`이었고, Footer는 바 바로 위로 돌아왔다.
- Lynx 원천(`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/KeyboardEvent.java`, revision `8688964`)은 가시 비율이 0.9 미만이면 `"on"`으로 보고(172행), relative height API의 높이를 Body 하단 − 가시 영역 하단으로 계산한다(180–185행). 이 기기에서는 키보드 없이도 `"on"`으로 판정됐고, 높이에는 바가 가린 영역이 들어갔다. 비율이 0.9 미만이 된 이유는 추적하지 않았다.
- 제스처 내비게이션, 다른 Android host, LynxView가 바 위에서 끝나는 host에서는 확인하지 않았다.

## 변경 이력

- 2026-10-06: KeyboardAvoidingScrollView Footer 기기 검증에서 기록했다.
- 2026-10-06: 재검증에서 48dp가 내비게이션 바가 가린 높이이고 Footer가 바 바로 위에 붙는 것을 확인했다. 결함 판정 기준을 바 상단 비교로 고쳤다.
- 2026-10-07: 사용자가 녹화한 Lynx Go 진입 화면에서 첫 평가 gate 뒤에도 Footer가 약 0.33s 동안 48dp 올라오는 것을 확인했다. focus 전 이동을 transition 없이 놓는 기준을 추가했다.
- 2026-10-07: 사용자 녹화에서 진입 때 Footer가 바 아래에 보였다가 올라오는 것을 확인했다. 감지가 첫 listener에서 시작되는 원천 근거와, 초기 상태를 기다리는 동안 숨기는 대응을 추가했다.
