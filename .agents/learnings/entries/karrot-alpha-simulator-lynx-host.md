---
id: karrot-alpha-simulator-lynx-host
description: iOS 시뮬레이터의 당근 alpha 앱(`com.towneers.www.dev`)을 `karrot.alpha://xview?renderer=lynx&url=<인코딩한 bundle URL>`로 열어 `examples/lynx-spa` 예제·소프트 키보드·native 입력을 검증할 때 읽는다. bundle URL의 `example` query가 사라져 SPA 홈이 열리거나, `Page.reload` 뒤 화면이 하얗게 비거나, agent-lynx `snapshot`·`tap` 직후 앱이 exit 1로 종료될 때 해당한다. 예제 진입, 실제 터치 입력, 잠금 정리 방법을 다룬다. PlayLynx·LynxExplorer host에는 적용하지 않는다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["playlynx-mac-input-events", "playlynx-ios-soft-keyboard", "lynx-explorer-evaluate-control"]
verified_at: "2026-10-27"
---

# 당근 alpha 시뮬레이터 host는 evaluate와 DeviceHub 실제 터치로 조작한다

## 교훈과 다음 행동

- 시뮬레이터는 Simulator 창 없이 부팅돼 있어 하드웨어 키보드가 연결되지 않는다 → native 입력에 focus하면 소프트 키보드가 뜬다. 키보드 표시·높이는 예제에서 `lynx.getJSModule("GlobalEventEmitter")`의 `keyboardstatuschanged`(`"on", 328` / `"off", 0`)를 기록해 판정하고, 화면은 `xcrun simctl io <udid> screenshot`으로 남긴다.
- 열기: `lynx-card.ts acquire` 뒤 `xcrun simctl openurl <udid> "karrot.alpha://xview?renderer=lynx&url=$(encodeURIComponent bundle URL)"`을 한 번 실행하고, 실행 전후 `list-sessions` 차이로 소유 session을 확정한다. `lynx-card.ts open`은 `lynx://open?url=`만 풀어 이 스킴의 session을 대조하지 못한다.
- host가 bundle URL의 query를 지워 `__pageUrl`에 `example`이 남지 않는다 → SPA 홈이 열린다. `Page.reload`에 query URL을 주면 `__pageUrl`은 바뀌지만 LynxView 전체가 그려지지 않는다. 검증 동안만 `examples/lynx-spa/src/App.tsx`에 `setRoute`를 전역으로 노출하는 한 줄을 넣고(HMR로 반영됨) `evaluate`로 예제를 연 뒤, 끝나면 되돌린다.
- 입력이 화면에 있을 때 agent-lynx `snapshot`·`tap`(DevTool `UITree.getUIInfoForNode`)을 실행하면 앱이 exit 1로 종료될 수 있다 → 입력 화면에서는 `evaluate`(UI method `focus`·`blur`, 로그 조회)만 쓴다.
- 탭·키보드 키는 실제 터치로 보낸다. `open -a /Applications/Xcode.app/Contents/Applications/DeviceHub.app`이 시뮬레이터 화면을 띄우고, 이 창에 보낸 macOS 마우스 클릭(CGEvent)이 터치로 전달된다. 창 좌표는 `System Events`의 창 position·size와 창 캡처로 기기 좌표에 맞춘다. 창 캡처는 DeviceHub가 앞에 있을 때만 하고, 다른 앱이 앞에 오면 `simctl` 캡처로 바꾼다.
- 앱이 종료되면 client의 `debugRouterId`가 바뀐다 → `release --host-terminated` 뒤 다시 `acquire`한다. 끝낼 때는 소유 session에서 `NavigationModule.close()`를 evaluate하고 session 목록이 비었는지 확인한 뒤 해제한다.

## 발생 근거와 적용 조건

- SEED-15(Lynx SearchInput), 2026-10-27: `seed-alpha-ios-26.44.0` 시뮬레이터(iOS 27.0), 당근 DEV(agent-lynx client sdkVersion 1.4.0), agent-lynx 0.14.2, `examples/lynx-spa` dev bundle(`ASSET_PREFIX=http://127.0.0.1:<port>/`).
- `openurl` 직후 `__pageUrl`은 `http://127.0.0.1:<port>/main.lynx.bundle`로 query가 없었다. query URL로 `Page.reload`하자 예제 tree는 생겼지만 snapshot이 `{hidden}`이고 화면은 흰색이었다.
- 입력에 focus한 화면에서 agent-lynx `tap`을 실행하자 로그에 `UITree.getUIInfoForNode` 요청 뒤 키보드 scene이 무효화되고 앱이 `voluntary` 종료(launchd status 256)됐다. 같은 현상이 두 번 재현됐다.
- DeviceHub 창의 클릭으로 Clear 버튼 탭, 키보드 자판 입력, 검색 키 제출이 모두 전달됐다. `ignore-focus`가 있는 Clear 탭 뒤 blur·`kb:off` 없이 키보드가 유지됐다.

## 변경 이력

- 2026-10-27: SEED-15 iOS 소프트 키보드 검증에서 기록했다.
