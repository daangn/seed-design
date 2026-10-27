---
id: playlynx-mac-input-events
description: Mac에서 직접 실행한 iOS PlayLynx(osType iOS, 부팅된 시뮬레이터 목록에 없음)로 SEED TextField·SearchInput 같은 native `<input>`의 입력·focus·blur·`bindconfirm`(제출)·`ignore-focus`를 검증할 때 읽는다. agent-lynx `tap`·`fill`이 입력을 `Ref @eN is disabled`로 거부할 때 focus와 입력을 넣는 방법, 이 host에서 판정할 수 없는 결과(focus 유지, 키보드 확인 키 제출, 소프트 키보드)를 다룬다. iOS 시뮬레이터·실기기·Android 검증에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/text-field/**", "docs/examples/lynx/**"]
status: active
related: ["playlynx-ios-soft-keyboard", "lynx-go-android-real-touch"]
verified_at: "2026-10-27"
---

# Mac PlayLynx는 입력 focus·제출 결과를 판정하는 host가 아니다

## 교훈과 다음 행동

- agent-lynx 0.14.2 `tap`·`fill`은 `disabled="false"` 속성이 있는 SEED 입력을 거부한다(`lynx-go-android-real-touch`와 같은 원인). Mac PlayLynx에서는 소유 session의 `evaluate`로 `lynx.createSelectorQuery().select("<입력 class>").invoke({ method: "focus" }).exec()`를 호출해 focus하고, 앱을 먼저 활성화한 뒤 macOS 키 입력으로 문자를 넣는다. 활성화를 focus 뒤에 하면 그 순간 blur가 온다.
- 결과는 화면에 상태를 쓰는 임시 예제(`bindfocus`·`bindblur`·`onValueChange`·`onSubmit` 로그)로 판정하고, 커밋 전에 지운다.
- 이 host에서는 다음을 판정하지 않는다 → iOS 시뮬레이터(하드웨어 키보드 끔, `playlynx-ios-soft-keyboard`)나 실기기에서 확인하고, 없으면 미확인으로 보고한다.
  - focus 유지: 다른 view를 클릭하면 `ignore-focus={true}`가 있어도 `blur → touchstart → touchend → tap` 순으로 blur가 먼저 온다. 실제 마우스 클릭(CGEvent)과 CDP `Input.emulateTouchFromMouseEvent`·agent-lynx `tap` 모두 같았다.
  - 제출: 하드웨어 Return은 `bindconfirm`을 보내지 않는다. 한글·일본어 IME가 켜져 있으면 Return이 조합 확정으로 소비돼 `bindinput`이 `""` 뒤 원래 값으로 다시 온다.
  - 소프트 키보드: 뜨지 않는다.
- macOS 입력 소스가 IME이면 키 입력이 조합 문자로 들어간다. 입력 값의 정확한 문자열을 판정하지 말고 값 변경 여부만 본다.

## 발생 근거와 적용 조건

- SEED-15(Lynx SearchInput), 2026-10-27: Mac에서 직접 실행한 PlayLynx(agent-lynx client의 osType iOS 26.7, sdkVersion 1.4.0), agent-lynx 0.14.2, `examples/lynx-spa` dev bundle의 임시 `search-input` focus 확인 예제.
- `ignore-focus="true"`가 DOM에 있는 Clear 버튼을 실제 클릭했을 때 로그가 `blur | ts | te | value: | tap` 순이었다. 하드웨어 Return 뒤에는 `submit` 로그가 없었고 `value: | value:dog`만 남았다.
- iOS 실기기·하드웨어 키보드를 끈 시뮬레이터에서의 `ignore-focus`·`bindconfirm` 동작은 확인하지 못했다.

## 변경 이력

- 2026-10-27: SEED-15 Mac PlayLynx 검증에서 기록했다.
