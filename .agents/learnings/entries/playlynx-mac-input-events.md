---
id: playlynx-mac-input-events
description: Mac에서 직접 실행한 iOS PlayLynx(osType iOS, 부팅된 시뮬레이터 목록에 없음)로 SEED TextField·SearchInput 같은 native `<input>`의 입력·focus·blur·`bindconfirm`(제출)·`ignore-focus`를 검증할 때 읽는다. agent-lynx `tap`·`fill`이 입력을 `Ref @eN is disabled`로 거부할 때 focus와 입력·Return을 넣는 방법, 한글 IME가 Return을 소비하는 함정, `ignore-focus`가 있어도 탭 직전에 오는 blur, 이 host에서 판정할 수 없는 소프트 키보드를 다룬다. iOS 시뮬레이터·실기기·Android 검증에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/text-field/**", "docs/examples/lynx/**"]
status: active
related: ["playlynx-ios-soft-keyboard", "lynx-go-android-real-touch"]
verified_at: "2026-10-27"
---

# Mac PlayLynx의 입력 검증은 evaluate focus와 숫자 키 입력으로 한다

## 교훈과 다음 행동

- agent-lynx 0.14.2 `tap`·`fill`은 `disabled="false"` 속성이 있는 SEED 입력을 거부한다(`lynx-go-android-real-touch`와 같은 원인). Mac PlayLynx에서는 소유 session의 `evaluate`로 `lynx.createSelectorQuery().select("<입력 class>").invoke({ method: "focus" }).exec()`를 호출해 focus하고, 앱을 먼저 활성화한 뒤 macOS 키 입력으로 문자를 넣는다. 활성화를 focus 뒤에 하면 그 순간 blur가 온다.
- 결과는 화면에 상태를 쓰는 임시 예제(`bindfocus`·`bindblur`·`onValueChange`·`onSubmit` 로그)로 판정하고, 커밋 전에 지운다.
- 제출은 하드웨어 Return(`key code 36`)으로 `bindconfirm`이 온다. 단 한글·일본어 IME가 켜져 있으면 문자 입력 뒤 Return이 조합 확정으로 소비돼 `bindconfirm` 없이 `bindinput`이 `""` 뒤 원래 값으로 다시 온다 → 조합되지 않는 숫자를 입력하고 Return을 보낸다. Return 뒤 다음 키 입력이 들어가는지로 focus 유지를 판정한다.
- 키 입력 사이에 다른 앱이 앞으로 오면 창이 key 상태를 잃으며 입력이 blur된다 → 판정 전에 `System Events`의 frontmost 프로세스가 PlayLynx인지 확인한다.
- 다른 view를 탭하면 `ignore-focus={true}`가 있어도 `blur → touchstart → touchend → tap` 순으로 blur가 먼저 온다. 실제 마우스 클릭(CGEvent)과 CDP `Input.emulateTouchFromMouseEvent`·agent-lynx `tap`, `flatten={false}` 모두 같았다. Lynx iOS 소스(`LynxEventHandler handleFocusOnView`)는 hit 대상의 `ignoreFocus`가 참이면 `endEditing`을 건너뛰므로 실기기 동작과 다를 수 있다 → focus 유지가 요구사항이면 탭 직전 blur를 감지해 되돌리는 경로를 두고(`SearchInput.ClearButton`), 실기기 결과는 따로 보고한다.
- 소프트 키보드는 뜨지 않는다 → 키보드 표시·내림은 iOS 시뮬레이터(하드웨어 키보드 끔, `playlynx-ios-soft-keyboard`)나 실기기에서 확인하고, 없으면 미확인으로 보고한다.

## 발생 근거와 적용 조건

- SEED-15(Lynx SearchInput), 2026-10-27: Mac에서 직접 실행한 PlayLynx(agent-lynx client의 osType iOS 26.7, sdkVersion 1.4.0), agent-lynx 0.14.2, `examples/lynx-spa` dev bundle의 임시 `search-input` focus 확인 예제.
- `ignore-focus="true"`가 DOM에 있는 Clear 버튼을 실제 클릭했을 때 로그가 `blur | ts | te | value: | tap` 순이었다. 입력기는 한글 IME(Araso)였고, 문자 뒤 Return은 `value: | value:dog`만 남겼다. 숫자 `123` 뒤 Return은 `submit:123 | blur`, `confirm-enter=true` 입력은 `submit:45` 뒤 다음 숫자가 이어 입력됐다. `SystemInfo.engineVersion`은 4.1이었다.
- iOS 실기기·하드웨어 키보드를 끈 시뮬레이터에서의 `ignore-focus`·`bindconfirm` 동작은 확인하지 못했다.

## 변경 이력

- 2026-10-27: SEED-15 Mac PlayLynx 검증에서 기록했다.
- 2026-10-27: 같은 작업의 재검증에서 Return이 `bindconfirm`을 보내지 않는다는 판정이 IME 때문이었음을 확인해 고쳤다. 숫자 입력·frontmost 확인 절차를 추가했다.
