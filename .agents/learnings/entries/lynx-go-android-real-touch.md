---
id: lynx-go-android-real-touch
description: Android 기기의 Lynx Go(`com.funcs.io.lynx.go`)로 `examples/lynx-spa` 예제를 검증하거나, Lynx Go Card가 `Error occurred while fetching app bundle resource`로 bundle을 받지 못하거나, overlay의 `event-through`·backdrop 탭·뒤로 가기처럼 CDP 에뮬레이션이 아닌 실제 터치가 필요한 결과를 확인할 때 읽는다. 기기와 개발 호스트의 Wi-Fi 서브넷이 달라 LAN URL에 닿지 않을 때의 `adb reverse` 연결과 `ASSET_PREFIX`, `example` query가 적용되지 않을 때의 진입 방법, snapshot dp 좌표를 `adb input` 픽셀로 바꾸는 방법, Card 정리 경로를 다룬다. iOS host나 CDP 탭으로 충분한 검증에는 적용하지 않는다.
scope: ["docs/examples/lynx/**", "examples/lynx-spa/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-explorer-evaluate-control", "lynx-device-cdp-geometry"]
verified_at: "2026-10-06"
---

# Android 실제 터치는 Lynx Go와 adb input으로 확인한다

## 교훈과 다음 행동

- 기기에서 개발 호스트의 LAN IP에 닿는지 먼저 확인한다(`adb shell ip -4 addr show wlan0`, `adb shell "toybox nc -w 3 <호스트 IP> <PORT> </dev/null"`). 서브넷이 달라 닿지 않으면 USB로 연결한다. `examples/lynx-spa`에서 `portless run --name <이름> sh -c 'ASSET_PREFIX="http://127.0.0.1:$PORT/" exec bun run dev'`로 띄우고, `adb reverse tcp:<PORT> tcp:<PORT>` 뒤 `http://127.0.0.1:<PORT>/main.lynx.bundle`을 연다. 검증이 끝나면 `adb reverse --remove tcp:<PORT>`로 지운다. 실기기에 `localhost`를 쓰지 않는다는 일반 규칙의 예외는 이 reverse 연결이 있을 때뿐이다.
- Lynx Go는 `agent-lynx open`의 `example` query를 적용하지 않고 SPA 홈을 연다 → `adb shell input swipe`·`input tap`으로 `문서 예제` 목록에서 대상 예제를 연다.
- agent-lynx snapshot 좌표는 dp다. `adb shell wm density`의 값/160을 곱해 픽셀로 바꾼다(420dpi → ×2.625). `adb shell input tap`은 native 터치라 `event-through`·backdrop·겹친 레이어의 탭 전달을 그대로 재현한다.
- 화면 캡처는 `adb shell screencap -p /sdcard/<name>.png` 뒤 `adb pull`로 받는다. `adb exec-out screencap`을 셸 출력으로 받으면 PNG가 깨질 수 있다.
- Lynx Go에는 Card를 닫는 명령이 없다. 소유 Card가 앞에 있을 때 `adb shell input keyevent KEYCODE_BACK`을 보내면 `LynxViewShellActivity`가 끝나 Card가 사라진다. 이후 `list-sessions`는 빈 목록 대신 `No response found`를 낼 수 있으므로 `dumpsys activity activities`에 `com.funcs.io.lynx.go` ActivityRecord가 없는지로 제거를 확인한다.
- Lynx Go에서도 agent-lynx `tap`(CDP)으로 SPA 목록 항목과 header 뒤로 가기를 누를 수 있다. 가로 `scroll-view`를 실제 drag로 옮긴 뒤 snapshot 좌표는 갱신되지 않을 수 있으므로 가로 스크롤 결과는 screenshot으로 판정한다.

## 발생 근거와 적용 조건

- DES-2679: Galaxy SM-F971N(Android API 37), Lynx Go 2026.06.06, `examples/lynx-spa` dev bundle, agent-lynx client `RFKL8097E5H:8901`.
  - query를 붙인 URL로 연 Card가 SPA 홈을 보여 목록 탭으로 진입했다.
  - `adb input tap`으로 overlay 모드 backdrop 탭이 아래 페이지로 넘어가는 것(`event-through` 기본 true)과 `event-through={false}`에서 backdrop이 받는 것을 구분해 확인했다.
  - view 모드에서 뒤로 가기를 보내자 Lynx Go 페이지가 닫혔다. `list-sessions`는 세 번 모두 응답이 없었고 ActivityRecord는 0개였다.
- 기기는 공유 자원이다. 잠금 화면이면 사용자에게 해제를 요청하고, 다른 작업의 앱이 앞에 있는 에뮬레이터·기기는 조작하지 않는다.
- DES-2631(ScrollFog Android 확인, 2026-10-06): 같은 기기·client, agent-lynx 0.14.2. 기기는 `192.168.124.29/22`, 호스트는 `192.168.9.235`라 `nc`가 timeout됐다. LAN URL로 연 Card는 `Error occurred while fetching app bundle resource`만 표시했다. 위 `adb reverse`와 `127.0.0.1` `ASSET_PREFIX`로 다시 연 Card는 SPA 홈을 표시했고 lazy 문서 예제도 열렸다.
  - `open`은 baseline의 `homepage.lynx.bundle` session을 목록에서 대체했다(baseline 2 → 새 session 3만 남음). 새 ID와 요청 URL이 일치하는 것으로 소유를 확정했다.
  - CDP `tap`으로 목록 진입·뒤로 가기가 동작했고, `adb input swipe`로 세로·가로 `scroll-view`가 스크롤됐다. 가로 drag 뒤 snapshot의 항목 x 좌표는 그대로였고 screenshot에서만 이동이 보였다.
  - query 미적용, 뒤로 가기로 Card 종료, ActivityRecord 0개 확인은 이번에도 같았다.

## 변경 이력

- 2026-09-29: DES-2679 OverlayView 검증 중 확인한 내용을 기록했다.
- 2026-10-06: DES-2631에서 서브넷이 다른 기기의 `adb reverse` 연결, CDP tap 동작, 가로 스크롤 뒤 snapshot 좌표 한계를 추가하고 기존 query·Card 정리 관찰을 재확인했다.
