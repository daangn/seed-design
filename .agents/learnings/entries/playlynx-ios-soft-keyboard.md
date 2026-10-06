---
id: playlynx-ios-soft-keyboard
description: iOS PlayLynx에서 KeyboardAvoidingScrollView·`keyboardstatuschanged`·키보드 위 Footer처럼 소프트 키보드에 반응하는 Lynx 동작을 검증하거나, 키보드와 화면 요소의 애니메이션 시점을 프레임 단위로 비교할 때 읽는다. Mac에서 직접 실행한 PlayLynx에는 소프트 키보드가 뜨지 않는 조건, 공유 시뮬레이터 설정을 바꾸지 않고 하드웨어 키보드를 끈 검증용 시뮬레이터를 만드는 절차, `simctl` 녹화의 가변 프레임 시각을 읽는 방법을 다룬다. Android Lynx Go의 키보드 이벤트는 lynx-go-keyboard-navbar-event를 본다.
scope: ["packages/lynx-react-headless/keyboard-avoiding-scroll-view/**", "packages/lynx-react/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["playlynx-simulator-overlay-check", "lynx-go-keyboard-navbar-event", "lynx-initial-transition-gate"]
verified_at: "2026-10-06"
---

# iOS 소프트 키보드 검증은 하드웨어 키보드를 끈 전용 시뮬레이터에서 한다

## 교훈과 다음 행동

- Mac에서 직접 실행한 PlayLynx에는 소프트 키보드가 뜨지 않는다 → 키보드 회피는 iOS 시뮬레이터에서 확인한다.
- 다른 작업자가 쓰는 시뮬레이터의 키보드 설정은 바꾸지 않는다 → `xcrun simctl create`로 검증용 시뮬레이터를 만들고, 부팅 전에 그 UDID에만 하드웨어 키보드 연결을 끈다.

  ```bash
  defaults write com.apple.iphonesimulator DevicePreferences -dict-add "$udid" '<dict><key>ConnectHardwareKeyboard</key><false/></dict>'
  ```

- PlayLynx는 이미 설치된 시뮬레이터에서 앱 번들을 가져와 설치한다: `xcrun simctl install "$udid" "$(xcrun simctl get_app_container <설치된 UDID> com.karrot.playlynx app)"`. 새 시뮬레이터의 PlayLynx는 별도 agent-lynx client로 잡히므로 그 client 이름으로 잠금을 얻는다.
- 처음 연 키보드에는 "slide to type" 안내 카드가 뜬다 → 화면 판정에 쓰는 프레임에 카드가 겹치는지 확인한다.
- 애니메이션 시점은 `xcrun simctl io "$udid" recordVideo --codec h264 <file>.mov`로 녹화하고 `ffmpeg -i <file>.mov -vf showinfo -fps_mode passthrough frames/%03d.png`로 encoded frame과 `pts_time`을 함께 뽑는다. 시뮬레이터 녹화는 화면이 바뀐 frame만 담는 가변 frame rate라서, 고정 fps로 샘플링하면 움직임의 시작·끝 시각이 흐려진다.
- 정리: 소유 Card를 닫은 뒤 시뮬레이터를 `shutdown`·`delete`한다. `defaults`는 `DevicePreferences`의 하위 키만 지우지 못하므로, 해당 UDID 항목은 `NSUserDefaults`(예: `osascript -l JavaScript`)로 제거한다.

## 발생 근거와 적용 조건

- 2026-10-06, KeyboardAvoidingScrollView Footer iOS 검증: Xcode 시뮬레이터 iPhone 17(iOS 26.5), PlayLynx, agent-lynx 0.14.2, `examples/lynx-spa` dev bundle의 `lynx/keyboard-avoiding-scroll-view/footer` 예제.
  - Mac에서 실행한 PlayLynx(iOS 26.6 보고)에서는 입력에 focus해도 소프트 키보드가 뜨지 않았다.
  - 하드웨어 키보드를 끈 새 시뮬레이터에서는 focus 52ms 뒤 `["on", 335]`, blur 9ms 뒤 `["off", 0]`이 왔다. Footer는 키보드 상단(874 − 335 = 539pt)에 붙었다.
  - 녹화의 `pts_time`으로 키보드가 2.248s에 움직이기 시작하고 Footer 버튼이 2.273–2.370s 동안 키보드에 가려지는 구간을 읽었다.
- 실제 iPhone과 다른 iOS 버전에서는 확인하지 않았다.

## 변경 이력

- 2026-10-06: KeyboardAvoidingScrollView Footer iOS 검증에서 기록했다.
