---
id: lynx-explorer-evaluate-control
description: iOS 시뮬레이터의 LynxExplorer(`com.lynx.LynxExplorer`)에서 agent-lynx로 Lynx 예제를 검증하다가 `tap`·`Input.emulateTouchFromMouseEvent`가 성공 응답을 내도 handler가 실행되지 않거나, `evaluate`가 `SyntaxError: expecting ')'`로 실패하거나, Card를 닫을 수 없을 때 읽는다. 탭 없이 임시 예제 상태를 바꾸는 evaluate 제어, 식 작성법, host 선택과 Card 정리 제약을 다룬다. PlayLynx처럼 CDP 탭이 동작하는 host에는 적용하지 않는다.
scope: ["docs/examples/lynx/**", "examples/lynx-spa/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-device-cdp-geometry", "lynx-loading-tap-device-check"]
verified_at: "2026-09-29"
---

# LynxExplorer 시뮬레이터에서는 CDP 탭 대신 evaluate로 임시 예제를 조작한다

## 교훈과 다음 행동

- CDP 탭이 필요한 검증은 PlayLynx에서 한다. LynxExplorer에는 Card를 닫을 공식 경로가 없어 한 번 열면 잠금을 풀 수 없다.
- LynxExplorer에서 확인해야 하면 임시 예제가 `useEffect`에서 `globalThis.__probe = { open, hide, set, logs }`처럼 상태 setter와 로그 조회를 노출하게 한다. `agent-lynx evaluate`로 호출하고 결과는 `__probe.logs()`로 읽는다. 탭 동작 자체(탭 전달, 바깥 탭)는 이 방법으로 확인할 수 없으므로 `환경 차단`으로 남긴다.
- `evaluate` 식은 CLI가 감싸서 실행하므로 `;`로 문장을 이으면 `SyntaxError: expecting ')'`가 난다 → `(__probe.open(), "ok")`처럼 쉼표 식을 쓴다.
- 시뮬레이터는 호스트의 `127.0.0.1`에 접근하므로 LAN URL 없이 검증할 수 있다. `examples/lynx-spa/lynx.config.ts`는 `ASSET_PREFIX`가 없으면 `PORTLESS_URL`(HTTPS `.test`)을 asset prefix로 쓰므로 lazy 예제가 로드되지 않을 수 있다 → dev 서버를 고정 port로 띄우고 `ASSET_PREFIX=http://127.0.0.1:<port>/`를 함께 준다.
- 열린 상태만 보면 되는 overlay 배치(예: `container` 모드 크기)는 `defaultOpen`·`skipAnimation` 임시 예제를 `Page.reload`의 `url`로 바꿔 가며 연다. `agent-lynx take-screenshot`은 lynxview만 찍으므로 Lynx view 밖까지 덮는 native `<overlay>`는 `xcrun simctl io booted screenshot <파일>`로 캡처한다.
- 이번 작업에서 직접 실행한 LynxExplorer라면 `xcrun simctl terminate booted com.lynx.LynxExplorer` 뒤 `list-clients`에서 client가 사라진 것으로 Card 제거를 확인하고 잠금을 푼다. 원래 실행 중이던 앱은 종료하지 않는다.
- 앱이 재시작되면 client ID(`localhost:890x`)가 다른 host를 가리킬 수 있다. 잠금 경로는 client ID 기준이므로, 기존 잠금 `owner.json`의 host 정보(`debugRouterId`)를 현재 `list-clients` 결과와 대조한 뒤 판단한다.

## 발생 근거와 적용 조건

- DES-2679: iOS 26.5 시뮬레이터의 LynxExplorer(Lynx SDK 1.4.0), `examples/lynx-spa` dev bundle, `agent-lynx` latest(2026-09-29).
  - `agent-lynx tap`은 `ok: true`를 반환하고, `DOM.getNodeForLocation`도 같은 좌표에서 대상 text를 가리켰다. 그러나 임시 예제의 `bindtap` 로그와 상태가 바뀌지 않았다. SPA 헤더의 뒤로 가기 버튼도 반응하지 않았다. `Input.emulateTouchFromMouseEvent` press·release를 직접 보내도 같았다.
  - 같은 session의 `evaluate`로 노출한 setter를 호출하자 상태가 바뀌고 `bindlayoutchange`·`bindshowoverlay`·`binddismissoverlay` 로그가 기록됐다.
  - `App.closePage`는 `not implemented`를 반환했다. `lynx.getNativeApp().nativeModuleProxy.NavigationModule`은 null이었다. 소유 Card를 정리하지 못해 잠금을 유지했다.
- 탭이 전달되지 않는 원인은 확인하지 않았다. PlayLynx에서 CDP 탭·drag가 동작한 기록은 `lynx-device-cdp-geometry`·`lynx-drag-gesture-cdp`에 있다.
- 피할 패턴: `tap`의 `ok: true`를 탭 전달로 보는 것. 탭이 안 된다고 새 Card를 여는 것.
- DES-2620: LynxExplorer가 꺼져 있어 `simctl launch`로 실행했다. `ASSET_PREFIX=http://127.0.0.1:4750/` dev bundle에서 `container="window"` Dialog 임시 예제 3종(보정 전·후, AlertDialog)을 열어 simctl 캡처로 비교했다. `NavigationModule.close()` 뒤에도 session이 남았고, 앱을 종료하자 client가 목록에서 사라졌다. DES-2679 잠금은 `localhost:8901`이 다른 host(PlayLynx)로 바뀐 뒤에도 남아 있었다.

## 변경 이력

- 2026-09-29: DES-2679 OverlayView 검증 중 확인한 내용을 기록했다.
- 2026-09-29: DES-2620에서 localhost 번들 제공, native overlay 캡처, 직접 실행한 앱의 정리, client ID 변동 확인을 추가했다.
