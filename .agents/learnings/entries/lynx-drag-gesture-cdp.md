---
id: lynx-drag-gesture-cdp
description: BottomSheet·MenuSheet(구 SwipeableMenuSheet)처럼 drag로 닫히거나 snap이 바뀌는 컴포넌트, Slider처럼 drag 중 값과 release 시 commit을 나눠 보는 컴포넌트, Sortable·reorderable Attachment처럼 long-press(`bindlongpress`) 뒤 drag로 순서를 바꾸는 컴포넌트, Main Thread touch handler로 직접 스크롤하는 컴포넌트, 또는 native `<scroll-view>` 스크롤과 당김 제스처를 중재하는 Lynx 컴포넌트(PullToRefresh 등)를 PlayLynx 기기에서 agent-lynx로 검증할 때 읽는다. drag·swipe 명령이 없는 agent-lynx 0.14.2에서 CDP touch 입력으로 press·move·release를 보내는 방법, `mousePressed`를 오래 유지해도 long-press가 시작되지 않을 때 `agent-lynx long-press`와 CDP move를 겹치는 방법과 확인하지 못한 범위, touch cancel을 기기에서 만들 수 없는 제약, 짧은 drag가 dismiss threshold를 넘어 닫힘으로 끝나는 판정 함정, CDP touch로 빠른 fling을 판정할 수 없는 한계와 native `<scroll-view>` 스크롤을 확인하지 못한 한 번의 관찰을 다룬다. iOS에서 CDP drag가 native 스크롤 거리를 반영하지 않을 때 Xcode Device Hub 창의 실제 마우스 drag로 확인하는 방법과 그 함정도 다룬다. tap·scroll만 필요한 검증이나 단위 테스트에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-loading-tap-device-check", "iphone-lan-asset-prefix", "lynx-ui-sheet-show-change-sources"]
verified_at: "2026-10-01"
---

# agent-lynx에 없는 drag는 CDP touch 입력으로 만든다

## 교훈과 다음 행동

- `agent-lynx` 0.14.2에는 tap·long-press·scroll만 있고 drag 명령이 없다. 소유 session에 `Input.emulateTouchFromMouseEvent`를 `mousePressed` → 여러 번의 `mouseMoved` → `mouseReleased` 순서로 보낸다. 좌표는 snapshot의 point 좌표를 쓴다.

```bash
T() { agent-lynx cdp --client "$CLIENT_ID" --session "$SESSION_ID" \
  --method Input.emulateTouchFromMouseEvent \
  "{\"type\":\"$1\",\"x\":195,\"y\":$2,\"button\":\"left\",\"clickCount\":1}"; }
T mousePressed 627; for y in 600 540 460 380 330; do T mouseMoved "$y"; done; T mouseReleased 330
```

- 이동 중간 상태가 필요하면 `mouseReleased` 전에 screenshot을 찍는다. 결과는 snapshot의 대상 좌표 변화나 `onSnapChange`·`onOpenChange`가 바꾼 화면 텍스트로 판정한다.
- touch cancel은 만들 수 없다. PlayLynx는 `Input.dispatchTouchEvent`에 `Not implemented`를 반환하고 `Input.emulateTouchFromMouseEvent`에는 cancel 종류가 없다. `catchtouchcancel` 경로는 단위 테스트로 확인하고 기기 결과는 `환경 차단`으로 보고한다.
- lynx-ui-sheet의 기본 dismiss threshold는 0.15다. 시트 높이의 15%를 넘는 짧은 아래 drag도 닫힘으로 끝난다. "원래 snap으로 돌아옴"을 확인하려면 이동 거리를 그보다 작게 잡는다.
- CDP touch는 Lynx touch 이벤트 전파(`bind`·`catch`)를 거친다. 자식의 `main-thread:catchtouch*`가 부모 시트의 drag를 막는지는 자식 위 drag와 부모 위 drag를 대조해 판정할 수 있다.
- `agent-lynx cdp` 호출 사이 간격이 길어 손을 뗄 때 속도가 0에 가까우므로 빠른 fling은 이 입력으로 판정하지 않는다.
- CDP touch로 native `<scroll-view>`가 스크롤되는지는 확인하지 못했다. 아래 임시 예제 한 곳의 관찰일 뿐 일반 한계로 단정하지 않는다. 바깥 native 스크롤과의 중재(`consume-slide-event`)를 CDP touch로 판정하려면 콘텐츠가 viewport보다 큰 `<scroll-view>`에서 drag가 실제로 스크롤되는지 먼저 확인하고, 스크롤되지 않으면 실제 터치로 확인한다.
- long-press로 시작하는 drag(`@seed-design/lynx-react-sortable`의 `main-thread:bindlongpress`)는 `agent-lynx long-press <ref> --duration <ms>`를 background로 실행하고 약 1.4초 뒤 같은 session에 `mouseMoved`를 20–40pt 간격으로 보내 시작한다. 이 command는 duration이 끝날 때 손을 떼므로 duration을 이동 명령 전체 시간보다 길게 잡는다(`agent-lynx cdp` 한 번에 약 0.5–1초).
  - 목록이 가로로 넘쳐 `<scroll-view>`가 스크롤 가능한 상태에서는 이 방법과 `mousePressed` 1.5초 유지 방법 모두 drag가 시작되지 않았다. 원인은 확인하지 못했다 → 이 경우의 drag·가장자리 autoscroll은 실제 터치로 확인하고, CDP 결과만으로 통과·실패를 판정하지 않는다.
- CDP touch는 native `<scroll-view>` 스크롤 거리를 반영하지 않을 수 있다. 아래 DES-2708 관찰에서 iOS CDP drag는 일부만 스크롤했다. 바깥 native 스크롤과의 중재(`consume-slide-event`, gesture-runtime `interceptGesture`)를 판정하려면 콘텐츠가 viewport보다 큰 `<scroll-view>`에서 입력 거리와 항목 이동량을 먼저 비교하고, 차이가 크면 실제 터치 입력으로 판정한다.
  - Android: `adb shell input swipe`(`lynx-go-android-real-touch`). 놓기 전 화면은 swipe를 별도 프로세스로 실행하는 동안 `screencap`으로 찍는다.
  - iOS 시뮬레이터: Xcode 27에는 `Simulator.app` 대신 Device Hub 창이 있다. 창의 PID·bounds와 기기 화면 rect를 매번 측정한 뒤 CGEvent 마우스 drag(`leftMouseDown` → 여러 `leftMouseDragged` → `leftMouseUp`)를 보내고, mouse-up 전에 `xcrun simctl io <udid> screenshot`으로 놓기 전 화면을 찍는다. macOS 손쉬운 사용·화면 기록 권한이 필요하다.
  - Device Hub는 다른 worktree·작업자가 고른 시뮬레이터를 표시하고 있을 수 있다. 소유 기기를 고르는 탭 뒤에도 창 캡처가 다른 기기 화면이면 그 경로를 `환경 차단`으로 기록하고, 창 전환을 반복하지 않는다.
- CDP touch는 native 스크롤 거리와 별개로 gesture-runtime `NativeGesture` callback을 구동한다. Main Thread가 소유하는 당김·변위(예: PullToRefresh의 진입·threshold·loading 치수)는 CDP 입력으로 판정할 수 있지만, native 스크롤과의 중재 결과는 실제 터치 근거와 따로 기록한다.

## 발생 근거와 적용 조건

- DES-2614에서 iOS PlayLynx(`com.karrot.playlynx`, iOS 26.6, SDK 1.4.0)의 `lynx-spa` production bundle로 확인했다.
  - `lynx/bottom-sheet/controlled`: Content를 아래로 끌어 닫았고, 부모 상태가 `false`가 되어 버튼으로 다시 열렸다. 약 80pt의 짧은 drag도 닫혔다.
  - `lynx/bottom-sheet/snap-points`: Handle을 위로 끌어 `snap index: 1`이 됐다.
  - `lynx/bottom-sheet/headless`: Handle을 위로 끌어 80% snap으로 펼쳤고, 아래로 끌어 닫았다.
- DES-2629에서 같은 기기의 `lynx/slider/value-changes`를 끌어 `mouseReleased` 전에는 onValuesChange 값만 바뀌고 commit 값은 그대로이며, release 뒤 commit 값이 같아지는 것을 확인했다. `{"type":"touchCancel"}`을 `Input.dispatchTouchEvent`로 보내자 `CDP request error: Not implemented: Input.dispatchTouchEvent`가 났다.
- loop-scroll headless 검증(iOS 27.0 시뮬레이터 PlayLynx, `lynx-spa` dev bundle, 임시 예제)에서 catch 전파를 확인하고 native scroll을 관찰했다.
  - 시트 Content 안의 `main-thread:catchtouch*` wheel을 아래로 90pt 끄는 동안 시트 제목의 y가 587pt로 유지되고 wheel index만 바뀌었다. 같은 시트의 제목을 같은 거리만큼 끌자 제목이 677pt로 내려가고 시트가 닫혔다.
  - 문서 예제 페이지 안 `<scroll-view>`의 빈 영역을 200pt 끌었을 때 예제가 표시한 `scrollTop`은 0으로 남았다. 콘텐츠가 viewport보다 컸는지와 drag 시작점이 `<scroll-view>`의 touch 영역이었는지는 기록하지 않았다.
- DES-2647에서 iOS 26.5 시뮬레이터 PlayLynx(SDK 1.4.0)의 `lynx-spa` dev bundle `lynx/attachment-display-field/reorderable`로 확인했다.
  - 항목 3개(넘치지 않음): `agent-lynx long-press @e35 --duration 4000`을 background로 실행하고 `mouseMoved`를 +20~+200pt로 보내자 첫 항목이 index 1로 옮겨졌다(`DOM.getDocument`의 image `src` 순서로 판정).
  - 항목 4개(가로 스크롤 가능): `mousePressed` 1.5초 유지 + `mouseMoved` 두 번, 위 long-press 방법을 duration 5000·15000으로 두 번 시도했다. drag 중 screenshot에 끌린 항목이 없었고 순서도 그대로였다.
- DES-2708(PullToRefresh, agent-lynx 0.14.2): iOS 26.5 시뮬레이터 PlayLynx(엔진 4.1)의 Scroll Fog 예제에서 CDP drag 110pt는 콘텐츠를 약 10pt, 135pt는 약 15pt만 스크롤했다. 같은 장면에서 Device Hub 창의 CGEvent 마우스 drag는 약 98pt 스크롤했고, mouse-up 전 simctl screenshot이 놓기 전 화면을 보였다. Android Lynx Go(엔진 4.0)는 `adb shell input swipe 625 760 625 490 3000` 진행 중 `screencap`으로 약 57dp 스크롤을 확인했다. 이후 다른 작업이 Device Hub에서 미부팅 시뮬레이터를 고른 상태에서는 소유 기기를 고르는 탭 뒤에도 그 미부팅 화면만 캡처됐다(원인 미확인).
- 같은 작업의 CDP drag는 PullToRefresh의 `NativeGesture`를 실제로 진입시켰다. 진입 뒤 손가락 80pt 이동(y 415→495)에 Content가 60px(×0.75) 이동했고, loading에서 Indicator 88px·spinner 24px·위아래 32px를 측정했다.
- 피할 패턴: drag 명령이 없다고 native drag·snap 검증을 `환경 차단`으로 남기는 것, 또는 짧은 drag의 닫힘을 회귀로 오판하는 것.

## 변경 이력

- 2026-09-28: DES-2614 BottomSheet 기기 검증에서 처음 기록했다.
- 2026-10-01: Lynx `SwipeableMenuSheet`가 `MenuSheet`로 이름이 바뀌어 description을 고쳤다(DES-2634). 같은 입력으로 iOS 26.5 시뮬레이터 PlayLynx의 `lynx/menu-sheet/open-change-reason`과 `lynx/bottom-sheet/controlled`를 drag로 닫았다.
- 2026-10-01: DES-2629 Slider 기기 검증에서 drag 중·release 판정과 touch cancel을 만들 수 없는 제약을 추가했다.
- 2026-10-01: Main Thread touch 스크롤 컴포넌트에 적용 범위를 넓히고, CDP touch의 catch 전파 판정 방법과 fling 판정 한계, native `<scroll-view>` 관찰을 추가했다(loop-scroll 검증).
- 2026-10-02: native `<scroll-view>` 관찰에 기록하지 않은 조건을 밝히고, 결론을 해당 임시 예제의 관찰로 좁혔다(PR #2390 리뷰).
- 2026-10-06: DES-2647 reorderable AttachmentDisplay 검증에서 long-press로 시작하는 drag의 입력 방법과, 가로 스크롤 가능한 목록에서 drag를 시작하지 못한 범위를 추가했다.
- 2026-10-07: DES-2708 PullToRefresh 검증에서 iOS CDP drag의 부분 스크롤, Device Hub 실제 마우스 drag 경로와 함정, 놓기 전 캡처 방법을 추가했다.
