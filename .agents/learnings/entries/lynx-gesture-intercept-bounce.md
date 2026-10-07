---
id: lynx-gesture-intercept-bounce
description: `@lynx-js/gesture-runtime` `NativeGesture`의 `interceptGesture(true)`로 `<scroll-view>`의 당김을 가로채고 Main Thread에서 그 scroll-view를 transform으로 옮기는 컴포넌트(PullToRefresh 등)를 만들거나, iOS에서 당긴 거리보다 콘텐츠가 더 많이 움직일 때, 당김 중 콘텐츠가 스크롤되어 Indicator와 겹칠 때, 또는 당김이 시작 직후 바로 끝나(start 다음 즉시 end·cancel) 움직이지 않을 때 읽는다. intercept가 iOS bounce와 같은 drag 안의 native 스크롤을 완전히 막지 않는다는 관찰, `bounces={false}`로 경계 변위의 소유자를 하나로 두는 기준, 제스처 중 `enable-scroll`을 바꾸면 당김이 끊긴 사례와 대신 `scrollTo(0)`으로 경계를 되돌리는 방법, MT 변위와 화면 이동을 비교하는 판정법을 다룬다. 바깥 문서 셸이 함께 움직이는 문제는 `lynx-scroll-owner-example-layout`을 본다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**"]
status: active
related: ["lynx-scroll-owner-example-layout", "lynx-drag-gesture-cdp"]
verified_at: "2026-10-06"
---

# gesture intercept로 scroll-view를 당길 때 iOS bounce는 따로 끈다

## 교훈과 다음 행동

- `interceptGesture(true)`로 native 스크롤을 가로채도 iOS scroll-view 경계의 bounce 변위는 따로 더해질 수 있다. 당김 변위를 MT transform이 소유하면 scroll host의 `bounces`를 `false`로 고정한다.
- 고정하면 아래쪽 경계의 iOS bounce도 사라진다. 공개 props에서 `bounces`를 빼고 JSDoc과 문서에 차이를 적는다. React PullToRefresh도 Root의 `overscroll-behavior-y: none`으로 양 끝 overscroll을 막는다.
- 판정할 때는 같은 입력에서 MT가 계산한 마지막 변위와 화면 속 같은 항목의 이동량을 함께 기록한다. 둘이 다르면 bounce나 바깥 scroller 같은 다른 변위 소유자가 있다.
- upstream lynx-ui FeedList의 hook refresh도 위쪽 bounce를 직접 소유할 때 List의 `bounces`를 끈다(`packages/lynx-ui-feed-list/src/index.tsx`의 `bounces={!enableBounce && !enableHookRefresh && bounces}`).
- 당김 중 같은 scroll-view의 `enable-scroll`을 바꾸지 않는다. 진행 중 제스처가 바로 끝나 당김이 전혀 동작하지 않았다. 당김 중 native 스크롤이 위쪽 경계를 벗어나면 `main-thread:bindscroll`에서 수락한 drag일 때만 `element.invoke("scrollTo", { offset: 0, index: 0, smooth: false })`로 되돌린다.

## 발생 근거와 적용 조건

- DES-2708 PullToRefresh(`@lynx-js/gesture-runtime` 2.1.1, iOS 26.5 시뮬레이터 PlayLynx, 엔진 4.1): 실제 마우스 drag로 짧게 당겼을 때 콘텐츠 항목은 약 96pt 이동했지만 MT의 마지막 변위는 59.25px였다. 차이 약 37pt는 Content scroll-view의 bounce였다. `bounces={false}`로 고정한 뒤 초과 이동이 사라졌다.
- Android(Lynx Go, 엔진 4.0)에서 `bounces`는 적용 대상이 아니다. 위쪽 overscroll(glow·stretch)이 당김 중에 보이는지는 확인하지 못했다.
- 같은 작업에서 ready 상태로 손을 떼지 않고 위아래로 움직이자 Content가 transform된 채 스크롤되어 첫 문단이 Indicator와 겹쳤다(iOS 실기기 영상). 이를 막으려고 당김을 수락한 순간 MT에서 `setAttribute("enable-scroll", false)`를 걸자, iOS 실기기에서 당길 때마다 `onPtrPullStart` 직후 `onPtrPullEnd`가 오고 Content가 움직이지 않았다. 속성 변경을 지우고 위 `scrollTo(0)` 보정으로 바꾸자 iOS·Android 실기기에서 당김과 겹침 방지가 모두 동작했다(사용자 확인). 속성 변경이 native recognizer를 취소시킨다는 내부 경로는 확인하지 않았다[추론]. lynx-ui FeedList도 `enable-scroll`을 Android나 refresh 진행 중에만 바꾼다(`hooks/useRefresh.ts`의 `enableScroll`).

## 변경 이력

- 2026-10-06: DES-2708에서 기록했다.
- 2026-10-07: DES-2708에서 제스처 중 `enable-scroll` 변경 회귀와 `scrollTo(0)` 대안을 추가했다.
