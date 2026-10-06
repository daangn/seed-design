---
id: lynx-go-keyboard-navbar-event
description: Android Lynx Go(`com.funcs.io.lynx.go`)에서 KeyboardAvoidingScrollView처럼 `keyboardstatuschanged`를 쓰는 Lynx 컴포넌트를 검증하다가, 키보드를 닫았는데 Footer가 화면 아래에서 떠 있거나 Content 아래 여백이 남을 때 읽는다. 키보드를 닫은 뒤에도 이벤트가 `"on"`과 내비게이션 바 높이로 오는 관찰, 이를 결함과 구분하는 판정식(키보드 상단 = page root bottom − height)과 키보드가 보이는 화면·좌표 증거를 모으는 방법을 다룬다. iOS host나 실제 키보드 높이 자체의 오차에는 적용하지 않는다.
scope: ["packages/lynx-react-headless/keyboard-avoiding-scroll-view/**", "docs/examples/lynx/keyboard-avoiding-scroll-view/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-go-android-real-touch", "lynx-device-cdp-geometry"]
verified_at: "2026-10-06"
---

# Lynx Go는 키보드를 닫아도 내비게이션 바 높이를 키보드로 보낼 수 있다

## 교훈과 다음 행동

- Lynx Go에서 키보드를 닫으면 `keyboardstatuschanged`가 `"off"` 대신 `["on", 48]`처럼 내비게이션 바 높이로 올 수 있다. 화면 진입 직후 키보드를 열기 전에도 같은 상태가 됐다. KeyboardAvoidingScrollView는 이 값을 열린 키보드로 처리하므로 Footer가 그만큼 올라가고 Content에 아래 여백이 남는다 → 결함으로 판정하기 전에 이벤트 값을 기록한다.
- 기록은 `agent-lynx evaluate`로 `lynx.getJSModule("GlobalEventEmitter").addListener("keyboardstatuschanged", (status, height) => …)`를 걸어 전역 배열에 모은다. 페이지를 reload하면 다시 건다.
- 판정: Android 키보드 상단은 `lynx.createSelectorQuery().selectRoot()`의 `boundingClientRect`(`relativeTo: "screen"`) bottom에서 이벤트 height를 뺀 값이다. Footer bottom(`androidEnableTransformProps: true`로 측정)이 이 값과 같으면 정상이다.
- 키보드는 Lynx view 밖에 그려지므로 화면 증거는 `adb shell screencap`으로 받는다. focus는 `adb shell input tap`(실제 터치)으로 열고, 키보드가 열린 동안의 `KEYCODE_BACK`으로 닫는다. 키보드가 닫힌 상태의 `KEYCODE_BACK`은 Card를 닫는다(`lynx-go-android-real-touch`).

## 발생 근거와 적용 조건

- 2026-10-06, KeyboardAvoidingScrollView Footer 추가 작업: Galaxy SM-F971N, Lynx Go, 3버튼 내비게이션, `examples/lynx-spa` dev bundle의 `lynx/keyboard-avoiding-scroll-view/footer` 예제.
  - 이벤트 기록은 `["on", 338]` → `KEYCODE_BACK` → `["on", 48]`이었다. page root bottom은 751.24dp였다.
  - Footer bottom은 키보드가 열렸을 때 413.33dp(751.24 − 338 = 413.24), 닫힌 뒤 703.24dp(751.24 − 48)였다.
- Lynx 원천(`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/KeyboardEvent.java`, revision `8688964`)의 `detectKeyboardChangeAndSendEvent`는 visible display frame과 view 높이의 차이로 키보드 높이를 계산한다. 내비게이션 바 높이가 이 차이에 들어간 것으로 보이지만, 어느 분기를 탔는지는 기기에서 추적하지 않았다.
- 제스처 내비게이션, 다른 Android host, iOS에서는 확인하지 않았다.

## 변경 이력

- 2026-10-06: KeyboardAvoidingScrollView Footer 기기 검증에서 기록했다.
