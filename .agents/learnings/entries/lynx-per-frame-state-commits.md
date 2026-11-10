---
id: lynx-per-frame-state-commits
description: Lynx headless·styled 컴포넌트가 열린 동안 매 frame 바뀌는 값(floating 레이어 위치·측정 rect, Slider drag 값 등)을 React state·context로 내려줄 때, 또는 여러 HelpBubble·Popover를 띄운 화면의 스크롤이나 Slider drag에서 "CallLepusMethod called too frequently"(`rLynxChange`)·`NoPatch!`가 몰릴 때 읽는다. `@lynx-js/react` 0.126 미만(Preact 10)에서 dirty component마다 따로 commit하는 구조, 모든 파트가 context consumer인 compound Root에서 children element를 새로 만들어 한 commit으로 묶는 방법, 값을 구독 store로 옮겨 그리는 요소만 렌더링하는 방법, 여러 레이어의 같은 native 측정을 묶는 방법과 logcat·iOS main thread hook·화면 녹화 판정 절차를 다룬다. 측정 높이·좌표의 기기 픽셀 반올림 반복은 `lynx-floating-subpixel-size-loop`을 읽는다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/src/components/**"]
status: active
related: ["lynx-js-call-frequency-warning", "lynx-android-hscroll-transform-rect", "lynx-floating-subpixel-size-loop"]
verified_at: "2026-11-10"
---

# 매 frame 바뀌는 값은 context 대신 구독 store로 내린다

## 교훈과 다음 행동

- ReactLynx는 Preact commit마다 main thread에 `rLynxChange`를 보내고, Preact는 rerender queue의 dirty component마다 따로 commit한다. Provider 값이 바뀌면 그 아래 consumer가 각자 queue에 들어가므로, 값 하나를 바꿔도 consumer 수만큼 commit과 main thread pipeline이 생긴다. 출력이 같으면 logcat에 `OnPatchFinishForFiber NoPatch!`로 남는다.
- 이 분리는 `@lynx-js/react` 0.126 미만(internal-preact 10.x)의 동작이다. Preact 10은 같은 vnode(`_original`)를 다시 받으면 dirty consumer도 건너뛴다. 0.126부터 쓰는 internal-preact 11은 dirty consumer를 부모와 같은 pass에서 렌더링해 한 commit으로 보낸다. 하한(`>=0.117.0`)을 지원하는 동안은 0.126 미만을 기준으로 설계하고, 테스트는 peer 하한 matrix(`.github/workflows/lynx-test.yml`)에서 검증한다.
- 모든 파트가 context consumer인 compound Root(Slider 등)는 Root가 `{children}` 대신 children element 트리를 `cloneElement`로 새로 만들어 렌더링한다 → 파트가 Root와 같은 pass에서 렌더링되어 갱신마다 commit이 1회가 된다. 중간에 consumer가 아닌 컴포넌트가 끼면 그 아래는 다시 따로 commit된다.
- 매 frame 바뀌는 값은 hook state나 context 값에 넣지 않는다 → 상태 소유 hook에 store(`getSnapshot`·`subscribe`)를 두고, 그리는 요소만 `useSyncExternalStore`(`@lynx-js/react`에서 export)와 selector로 구독한다. selector는 원시값을 반환해 실제로 바뀐 요소만 렌더링되게 한다. 탭 판정처럼 렌더링에 쓰지 않는 값은 handler에서 `getSnapshot()`으로 읽는다.
- 방향·`positioned`처럼 드물게 바뀌는 파생값만 state로 두고, styled Root가 recipe 결과를 context로 내리면 `useMemo`로 같은 값을 유지한다. recipe 함수는 호출마다 새 객체를 반환한다.
- 여러 레이어가 같은 frame에 같은 native 측정(`selectRoot()` rect 등)을 하면 진행 중인 Promise 하나를 함께 쓴다. selector identifier가 같은 호출은 DevTool 빈도 경고에서 한 key로 합산된다.
- 판정 절차:
  - 스와이프 전후 logcat을 `-v epoch`로 받아 첫 `touchmove` 기준 100ms 구간별로 `rLynxChange`·`NoPatch!`·`InvokeUIMethod with root`를 센다. 레이어별 측정 주기는 `InvokeUIMethod`의 `react-ref` identifier 수를 레이어 수와 시간으로 나눠 구한다.
  - 원인 분리에는 측정 loop의 RAF 시작·측정 완료·완료 뒤 시각을 `[DEBUG-…]` 태그 log로 남긴다. 측정 완료와 다음 RAF 사이에 commit이 몰려 있으면 이 교훈에 해당한다.
  - iOS처럼 logcat이 없으면 소유 session에서 `agent-lynx evaluate --thread main`으로 main thread의 `globalThis.rLynxChange`를 감싸 횟수·`data`를 기록한다. background의 `lynx.getNativeApp().callLepusMethod`는 native 함수라 덮어쓰기가 조용히 무시되어 셀 수 없었다.
  - 컴포넌트 전체를 훑을 때는 peer 하한(0.117.0) 설치에서 임시 vitest setup으로 `fireEvent.*`를 감싸 이벤트 하나당 `rLynxChange` 수를 기록한다. 같은 환경에서 Preact dist의 component bailout(`newVNode.__v == oldVNode.__v`)에 `&& !c.__d`를 붙이고 host bailout을 끄면 Preact 11 동작을 흉내 낸 상한이 나온다. 두 값의 차이가 consumer fan-out 몫이다. 패치는 임시 worktree의 `node_modules`에만 한다.
  - 화면은 `adb shell screenrecord`로 녹화하고 같은 시각의 프레임을 수정 전후로 나란히 비교한다. 레이어 배치가 반복되는 예제에서는 열 단위 상관으로 지연을 자동 계산하면 이웃 레이어와 혼동되므로 쓰지 않는다.

## 발생 근거와 적용 조건

- 상황: `@seed-design/lynx-react-popover`의 `usePopover`가 위치·rect 네 값을 state로 두고 context로 내렸다. 측정 loop는 레이어마다 RAF에서 기준 요소와 root를 측정하고 `setPosition`을 호출한다.
- 확인 환경: Galaxy A24(SM-A245N, Android 15), Lynx Go, DevTool 연결, docs production bundle의 `lynx/help-bubble/placement`(말풍선 12개, 가로 `scroll-view`). `adb shell input swipe`로 가로 스크롤했다.
  - 수정 전: 스크롤 중 `rLynxChange` 497회/s, `NoPatch!` 436회/s, 레이어별 측정 10.6회/s. 정지 상태에서도 root 측정 key가 5초에 1773회라 InvokeUIMethod 경고가 떴다. 측정 완료 뒤 레이어 하나의 갱신마다 commit 8–9개가 이어졌고, 다음 RAF까지 60–90ms가 걸렸다.
  - context를 위치·나머지로 나눈 중간 단계: commit 245회/s, 갱신당 3개(Root·Positioner·Arrow)였다.
  - store로 옮긴 뒤: commit 148회/s, `NoPatch!` 9회/s, 레이어별 측정 25.5회/s, 정지 상태 root key 233회/5s. 녹화에서 말풍선이 기준 요소를 따라오는 거리가 줄었다.
- 남은 한계: 레이어마다 갱신이 따로 commit되므로 12개를 5초 넘게 계속 스크롤하면 `rLynxChange`가 경고 기준(5초 800회)에 닿는다. background thread에서 비동기로 측정하고 commit하는 구조라 빠른 스크롤에서는 몇 frame 늦게 따라온다. DevTool 연결 시 DebugRouter가 style 변경마다 `DOM.attributeModified`를 보내는 부담도 측정에 섞여 있다.
- main thread 추적은 같은 기기에서 더 나빴다 → 레이어마다 main thread RAF loop를 두는 방식은 쓰지 않는다. 레이어마다 `MainThread.Element.invoke("boundingClientRect")`로 기준 요소를 매 frame 측정하고 `setStyleProperties`로 `left`·`top`을 옮기는 시제품을 만들어, 같은 스와이프 3왕복의 `dumpsys gfxinfo`를 비교했다.
  - background store 방식(기준): janky 6–7%, 50th 8ms, 90th 13–14ms.
  - 측정과 style 적용: janky 90%, 50th 53ms. 측정만: 49%. 측정 없이 빈 RAF loop 12개만: 36%. Android Lynx Go에서는 main thread가 UI thread라, 레이어마다 도는 main thread frame callback 자체가 스크롤 frame을 밀어낸다.
  - 값이 같으면 `setStyleProperties`를 건너뛰어야 정지 상태의 `NoPatch!`(초당 약 750회)가 사라진다.

- Slider drag(2026-11-10): iOS 26.7 시뮬레이터 PlayLynx, probelynx와 같은 toolchain(`@lynx-js/react` 0.117.1, rspeedy 0.13.6)으로 만든 임시 bundle에 registry `ui:slider` 단일·range 두 개를 두고 CDP touch로 끌었다.
  - 수정 전: move 10회 drag에 `rLynxChange` 162회(단일)·112회(range)였다. 단일 thumb의 move 하나는 Root와 파트 8개(Control·Track·Range·ValueIndicatorRoot·Arrow·ArrowTip·Label·Thumb)로 9개 commit이었고, 그중 여럿이 빈 patch였다.
  - Root가 children을 새로 만든 뒤: 같은 입력에 18회·8회였다. 남은 추가 commit은 Value Indicator 폭 측정 setState다. `onValuesChange`·`onValuesCommit` 횟수와 값은 같았다.
  - probelynx CI(iPhone 17 시뮬레이터)에서 drag 시나리오를 연달아 실행할 때 이 경고가 떴다. Android 캡처에는 없었고, 같은 Slider 코드로 찍은 이전 baseline에도 없었다 → 5초 창 합계가 800 근처라 실행 타이밍에 따라 보이거나 사라지는 것으로 추정한다(CI 로그로는 확인하지 못했다).
  - 단위 테스트(0.117.0 override)는 수정 전 move 하나에 9회(lynx-react)·5회(headless)였다. 0.129.1에서는 수정 전에도 1회였다.

## 변경 이력

- 2026-10-14: HelpBubble 가로 스크롤 추적 지연·빈도 경고 조사에서 기록했다.
- 2026-10-14: main thread 추적 시제품의 gfxinfo 비교 결과를 추가했다.
- 2026-11-10: Slider drag 경고 조사에서 `@lynx-js/react` 0.126 미만 조건, compound Root children 재생성 방법, iOS main thread hook 판정을 추가했다. 핵심 주장(consumer별 commit)을 iOS PlayLynx에서 다시 확인했고, Popover 측정은 다시 하지 않았다.
- 2026-11-10: lynx-react 테스트 전체에서 consumer fan-out 후보를 훑는 측정법을 추가했다.
