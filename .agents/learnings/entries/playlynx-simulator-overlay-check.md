---
id: playlynx-simulator-overlay-check
description: "iOS 시뮬레이터 PlayLynx에서 portless로 띄운 `examples/lynx-spa` 개발 서버를 열 때 App Transport Security 오류 Card가 뜨거나, `container`를 지정한 native overlay 레이어(`<overlay>`)의 drag·backdrop 탭을 agent-lynx로 검증하려 할 때 읽는다. 시뮬레이터에서 열리는 bundle URL·ASSET_PREFIX 조건, 개발 중 lib 재빌드로 PlayLynx가 종료되는 조건, overlay 레이어에 자동 입력이 전달되지 않는 범위를 다룬다. 실기기의 LAN URL 조건은 iphone-lan-asset-prefix를 본다."
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["iphone-lan-asset-prefix"]
verified_at: "2026-09-30"
---

# 시뮬레이터 PlayLynx는 loopback bundle로 열고, overlay 입력은 실제 터치로 확인한다

## 교훈과 다음 행동

- portless가 넘기는 `PORTLESS_URL`(`http://<name>.test`)은 `lynx.config.ts`의 기본 `dev.assetPrefix`가 된다. PlayLynx는 이 http 도메인을 ATS로 막고 Lynx session 없는 오류 Card를 남긴다 → 시뮬레이터 검증은 `portless run --name <name> sh -c 'ASSET_PREFIX="http://127.0.0.1:$PORT" exec bun run dev'`로 띄우고 `http://127.0.0.1:<PORT>/main.lynx.bundle?example=…`을 연다.
- 오류 Card에는 Lynx session이 없어 `NavigationModule.close()`로 닫을 수 없다 → open 전에 URL 조건을 맞춘다. 이미 생겼으면 잠금을 유지하고 사용자에게 Card 정리를 요청한다.
- 개발 서버가 떠 있는 동안 `bun lynx-headless:build`로 lib를 다시 만들면 중간 빌드가 `Module not found`로 실패하고, 그 결과를 받은 PlayLynx가 종료될 수 있다 → lib 재빌드 전에 소유 Card를 닫거나, 재빌드 뒤 서버 로그의 `ready`를 확인하고 PlayLynx 상태를 다시 확인한다.
- `container`를 지정한 overlay 레이어에는 `agent-lynx tap`과 `Input.emulateTouchFromMouseEvent`가 전달되지 않았고 `Input.dispatchTouchEvent`는 `Not implemented`였다 → overlay 모드의 drag·snap·backdrop 닫힘은 Simulator 창이나 기기의 실제 터치로 확인하고, 자동 검증은 DOM(`DOM.getDocument`)의 레이어 style과 스크린샷 레이아웃까지만 주장한다.

## 발생 근거와 적용 조건

- 환경: iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0), agent-lynx 0.14.2, portless 0.15.3, DES-2680 검증.
- `http://<worktree>.ette.test:<port>/main.lynx.bundle` open → "App Transport Security policy requires the use of a secure connection" 오류 Card, session 목록 변화 없음. `ASSET_PREFIX=http://127.0.0.1:$PORT`로 재시작한 뒤 같은 예제가 session으로 열렸다.
- 서버 실행 중 `bun lynx-headless:build` → lynx-spa 빌드가 `@seed-design/lynx-react-use-press-tap` 해석 실패로 한 번 실패했고, PlayLynx가 SIGABRT로 종료됐다. crash report의 원인은 `PlayLynxWindowScreenController.showLoadError`가 NSURLSession delegate 큐에서 UIKit을 호출한 것이다(host 결함).
- overlay 모드 BottomSheet를 연 상태에서 backdrop ref tap, 핸들 drag(`emulateTouchFromMouseEvent`)를 보냈으나 화면이 바뀌지 않았다. view 모드와의 대조는 reload 뒤 화면이 비어 완료하지 못했다.

## 변경 이력

- 2026-09-30: DES-2680 검증 중 확인한 ATS·재빌드 종료·overlay 입력 범위를 기록했다.
