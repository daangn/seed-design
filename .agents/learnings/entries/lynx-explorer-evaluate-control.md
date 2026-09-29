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

## 발생 근거와 적용 조건

- DES-2679: iOS 26.5 시뮬레이터의 LynxExplorer(Lynx SDK 1.4.0), `examples/lynx-spa` dev bundle, `agent-lynx` latest(2026-09-29).
  - `agent-lynx tap`은 `ok: true`를 반환하고, `DOM.getNodeForLocation`도 같은 좌표에서 대상 text를 가리켰다. 그러나 임시 예제의 `bindtap` 로그와 상태가 바뀌지 않았다. SPA 헤더의 뒤로 가기 버튼도 반응하지 않았다. `Input.emulateTouchFromMouseEvent` press·release를 직접 보내도 같았다.
  - 같은 session의 `evaluate`로 노출한 setter를 호출하자 상태가 바뀌고 `bindlayoutchange`·`bindshowoverlay`·`binddismissoverlay` 로그가 기록됐다.
  - `App.closePage`는 `not implemented`를 반환했다. `lynx.getNativeApp().nativeModuleProxy.NavigationModule`은 null이었다. 소유 Card를 정리하지 못해 잠금을 유지했다.
- 탭이 전달되지 않는 원인은 확인하지 않았다. PlayLynx에서 CDP 탭·drag가 동작한 기록은 `lynx-device-cdp-geometry`·`lynx-drag-gesture-cdp`에 있다.
- 피할 패턴: `tap`의 `ok: true`를 탭 전달로 보는 것. 탭이 안 된다고 새 Card를 여는 것.

## 변경 이력

- 2026-09-29: DES-2679 OverlayView 검증 중 확인한 내용을 기록했다.
