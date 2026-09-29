---
id: lynx-go-android-real-touch
description: Android 기기의 Lynx Go(`com.funcs.io.lynx.go`)로 `examples/lynx-spa` 예제를 검증하거나, overlay의 `event-through`·backdrop 탭·뒤로 가기처럼 CDP 에뮬레이션이 아닌 실제 터치가 필요한 결과를 확인할 때 읽는다. `example` query가 적용되지 않을 때의 진입 방법, snapshot dp 좌표를 `adb input` 픽셀로 바꾸는 방법, Card 정리 경로를 다룬다. iOS host나 CDP 탭으로 충분한 검증에는 적용하지 않는다.
scope: ["docs/examples/lynx/**", "examples/lynx-spa/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-explorer-evaluate-control", "lynx-device-cdp-geometry"]
verified_at: "2026-09-29"
---

# Android 실제 터치는 Lynx Go와 adb input으로 확인한다

## 교훈과 다음 행동

- Lynx Go는 `agent-lynx open`의 `example` query를 적용하지 않고 SPA 홈을 연다 → `adb shell input swipe`·`input tap`으로 `문서 예제` 목록에서 대상 예제를 연다.
- agent-lynx snapshot 좌표는 dp다. `adb shell wm density`의 값/160을 곱해 픽셀로 바꾼다(420dpi → ×2.625). `adb shell input tap`은 native 터치라 `event-through`·backdrop·겹친 레이어의 탭 전달을 그대로 재현한다.
- 화면 캡처는 `adb shell screencap -p /sdcard/<name>.png` 뒤 `adb pull`로 받는다. `adb exec-out screencap`을 셸 출력으로 받으면 PNG가 깨질 수 있다.
- Lynx Go에는 Card를 닫는 명령이 없다. 소유 Card가 앞에 있을 때 `adb shell input keyevent KEYCODE_BACK`을 보내면 `LynxViewShellActivity`가 끝나 Card가 사라진다. 이후 `list-sessions`는 빈 목록 대신 `No response found`를 낼 수 있으므로 `dumpsys activity activities`에 `com.funcs.io.lynx.go` ActivityRecord가 없는지로 제거를 확인한다.

## 발생 근거와 적용 조건

- DES-2679: Galaxy SM-F971N(Android API 37), Lynx Go 2026.06.06, `examples/lynx-spa` dev bundle, agent-lynx client `RFKL8097E5H:8901`.
  - query를 붙인 URL로 연 Card가 SPA 홈을 보여 목록 탭으로 진입했다.
  - `adb input tap`으로 overlay 모드 backdrop 탭이 아래 페이지로 넘어가는 것(`event-through` 기본 true)과 `event-through={false}`에서 backdrop이 받는 것을 구분해 확인했다.
  - view 모드에서 뒤로 가기를 보내자 Lynx Go 페이지가 닫혔다. `list-sessions`는 세 번 모두 응답이 없었고 ActivityRecord는 0개였다.
- 기기는 공유 자원이다. 잠금 화면이면 사용자에게 해제를 요청하고, 다른 작업의 앱이 앞에 있는 에뮬레이터·기기는 조작하지 않는다.

## 변경 이력

- 2026-09-29: DES-2679 OverlayView 검증 중 확인한 내용을 기록했다.
