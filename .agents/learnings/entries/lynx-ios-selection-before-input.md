---
id: lynx-ios-selection-before-input
description: Lynx native `<input>`의 `bindselection`으로 입력 전 caret 위치를 기억해 `bindinput`의 삽입 위치·끝 입력 여부를 판단하는 코드(SegmentedTextInput 자동 이동, 붙여넣기 판정 등)를 작성·검증할 때 읽는다. iOS에서만 끝에서 입력해도 "끝 입력"으로 판정되지 않아 자동 이동이 멈추는 증상, Android 결과만으로 이벤트 순서를 가정하는 결정 시점에 해당한다. 입력 이벤트 순서와 보정 방법을 다룬다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/text-field/**"]
status: active
related: ["karrot-alpha-simulator-lynx-host"]
verified_at: "2026-10-29"
---

# iOS Lynx input은 입력 뒤 selection을 bindinput보다 먼저 보낸다

## 교훈과 다음 행동

- iOS에서는 한 글자를 입력하면 입력 뒤 caret 위치의 `bindselection`(예: `selectionStart=1`)이 같은 입력의 `bindinput`보다 먼저 온다. 마지막 selection을 "입력 전 caret"으로 쓰면 끝에서 입력해도 caret이 이전 값 길이보다 뒤에 있어 끝 입력이 아닌 것으로 판정된다.
- 입력 전 selection을 쓸 때는 이전 값 길이로 자른다(`Math.min(start, value.length)`). 값 끝을 넘는 selection은 입력 직후 caret이므로 입력 전 끝으로 본다. Android처럼 `bindinput`이 먼저 오는 순서에서도 결과가 같다.
- Vitest에서는 `bindselection`을 입력보다 먼저 보내는 경우를 따로 재현한다. Android 기기 검증만으로 순서를 확정하지 않는다.

## 발생 근거와 적용 조건

- SEED-22(Lynx SegmentedTextInput), 2026-10-29: iOS 27.0 시뮬레이터의 당근 DEV host(sdkVersion 1.4.0), `examples/lynx-spa` dev bundle의 임시 probe 예제. 빈 Segment에 `4`를 입력하자 로그가 `b sel 1` → `onValueChange ["12","4"]` → `b input "4"` 순이었다.
- 같은 조건에서 masked Segment(`12`)에 `3`, `4`를 입력해 칸을 채워도 다음 Segment로 focus가 옮겨 가지 않았다. selection을 값 길이로 자르자 `3`, `4`, `5` 입력이 칸을 채우고 다음 Segment의 첫 자리로 이어졌다.
- 이전 Android 에뮬레이터 검증(Karrot Alpha Debug)에서는 같은 코드로 자동 이동이 동작했다.

## 변경 이력

- 2026-10-29: SEED-22 iOS 시뮬레이터 검증에서 기록했다.
