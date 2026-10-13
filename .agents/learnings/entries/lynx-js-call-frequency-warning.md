---
id: lynx-js-call-frequency-warning
description: PlayLynx·Lynx DevTool 화면에 "InvokeUIMethod called too frequently" 또는 "CallLepusMethod called too frequently" 알림이 뜰 때, 그 경고가 기능 오류인지 판단하거나 원인 호출을 찾을 때 읽는다. 경고가 호출을 막지 않는 DevTool 전용 계측이라는 점, 메서드·노드별 key와 5초 800회 기준, logcat으로 key와 호출원을 찾는 방법을 다룬다. 좌표 소수 부분 때문에 레이어 크기가 반복해서 바뀌는 문제는 `lynx-floating-subpixel-size-loop`을 읽는다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**", "examples/lynx-spa/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-floating-subpixel-size-loop", "lynx-android-hscroll-transform-rect"]
verified_at: "2026-10-13"
---

# "called too frequently"는 호출을 막지 않는 DevTool 경고다

## 교훈과 다음 행동

- 이 알림은 `JsCallNativeFrequencyMonitor`가 보내는 Warn 수준 `LynxError`다. 호출은 그대로 실행된다. 그래서 위치 추적 멈춤 같은 기능 결함의 원인으로 보지 않는다. 모니터는 DevTool이 켜졌거나 env를 지정했을 때만 동작한다.
- key는 `CallLepusMethod`면 메서드 이름이고, `InvokeUIMethod`면 메서드·root·node selector 문자열이다. 기본 5초 창에서 key 하나가 800회에 이르면 알린다. 이후 60초 cooldown 동안은 다시 알리지 않는다.
  - `selectRoot()` 측정은 identifier가 빈 같은 key를 쓴다. 그래서 여러 floating 레이어가 매 frame root를 측정하면 개별 노드 호출은 기준 아래라도 합산되어 경고가 난다.
  - 노드마다 따로 측정하는 호출(예: 안전 영역 probe)은 key가 달라 이 경고를 늘리지 않는다.
- 호출원 찾기: logcat의 `lynx_error.cc` 줄에서 `method_name:`을 읽는다. `CallLepusMethod: <이름>`·`InvokeUIMethod with root … identifier:` 줄을 초 단위로 센다. ReactLynx의 `rLynxChange`는 background render commit마다 main thread로 보내는 호출이다. 그래서 이 key가 많다는 것은 짧은 시간에 commit이 몰렸다는 뜻이다.
- 긴 목록에서 `rLynxChange`가 몰리면 항목이 다시 렌더링되는 원인부터 찾는다. Select에서는 두 원인이 있었다. 항목이 ref 연결을 state로 등록하던 것(`setNodeAttached`)과, 항목이 열림·위치 상태까지 담긴 context를 읽던 것이다. 등록에는 node 대신 ref 객체를 넘기고, 항목에는 열림 상태가 빠진 별도 context를 주면 열 때 항목이 다시 렌더링되지 않는다.

## 발생 근거와 적용 조건

- Lynx 원천(`8688964`): `core/runtime/common/js_call_native_frequency_monitor.cc`의 `Record`, `core/renderer/utils/lynx_env.cc`의 기본값(창 5000ms, 기준 800, cooldown 60000ms, `IsDevToolEnabled()` 조건), `core/runtime/js/bindings/js_app.cc`의 `InvokeUIMethod`·`CallLepusMethod`.
- Android API 36 에뮬레이터 PlayLynx, lynx-spa dev bundle에서 측정했다.
  - `lynx/help-bubble/placement`: root key가 5초에 1801–2280회였다. 말풍선별 노드 key는 151–190회였다.
  - `lynx/select/long-list`: 열기 전 mount 2.5초 동안 `rLynxChange`가 1118회였다. 항목 4개인 `select/preview`는 83회, `help-bubble/preview`는 35회였다. `useSelectItem`의 `setNodeAttached`를 임시로 끄자 260회로 줄었다.

## 변경 이력

- 2026-10-13: C8 후속 조사에서 기록했다.
- 2026-10-13: Select 수정 후 `select/long-list`의 `rLynxChange`를 다시 셌다. mount는 1118회에서 20회로, 열기는 약 1000회에서 40회로 줄었고 경고가 사라졌다. 열 때 항목 render는 96회에서 0회가 됐다.
