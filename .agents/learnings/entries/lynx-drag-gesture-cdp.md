---
id: lynx-drag-gesture-cdp
description: BottomSheet·MenuSheet(구 SwipeableMenuSheet)처럼 drag로 닫히거나 snap이 바뀌는 컴포넌트, Slider처럼 drag 중 값과 release 시 commit을 나눠 보는 Lynx 컴포넌트를 PlayLynx 기기에서 agent-lynx로 검증할 때 읽는다. drag·swipe 명령이 없는 agent-lynx 0.14.2에서 CDP touch 입력으로 press·move·release를 보내는 방법, touch cancel을 기기에서 만들 수 없는 제약, 짧은 drag가 dismiss threshold를 넘어 닫힘으로 끝나는 판정 함정을 다룬다. tap·scroll만 필요한 검증이나 단위 테스트에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-loading-tap-device-check", "iphone-lan-asset-prefix", "lynx-ui-sheet-show-change-sources"]
verified_at: "2026-09-28"
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

## 발생 근거와 적용 조건

- DES-2614에서 iOS PlayLynx(`com.karrot.playlynx`, iOS 26.6, SDK 1.4.0)의 `lynx-spa` production bundle로 확인했다.
  - `lynx/bottom-sheet/controlled`: Content를 아래로 끌어 닫았고, 부모 상태가 `false`가 되어 버튼으로 다시 열렸다. 약 80pt의 짧은 drag도 닫혔다.
  - `lynx/bottom-sheet/snap-points`: Handle을 위로 끌어 `snap index: 1`이 됐다.
  - `lynx/bottom-sheet/headless`: Handle을 위로 끌어 80% snap으로 펼쳤고, 아래로 끌어 닫았다.
- DES-2629에서 같은 기기의 `lynx/slider/value-changes`를 끌어 `mouseReleased` 전에는 onValuesChange 값만 바뀌고 commit 값은 그대로이며, release 뒤 commit 값이 같아지는 것을 확인했다. `{"type":"touchCancel"}`을 `Input.dispatchTouchEvent`로 보내자 `CDP request error: Not implemented: Input.dispatchTouchEvent`가 났다.
- 피할 패턴: drag 명령이 없다고 native drag·snap 검증을 `환경 차단`으로 남기는 것, 또는 짧은 drag의 닫힘을 회귀로 오판하는 것.

## 변경 이력

- 2026-09-28: DES-2614 BottomSheet 기기 검증에서 처음 기록했다.
- 2026-10-01: Lynx `SwipeableMenuSheet`가 `MenuSheet`로 이름이 바뀌어 description을 고쳤다(DES-2634). 같은 입력으로 iOS 26.5 시뮬레이터 PlayLynx의 `lynx/menu-sheet/open-change-reason`과 `lynx/bottom-sheet/controlled`를 drag로 닫았다.
- 2026-10-01: DES-2629 Slider 기기 검증에서 drag 중·release 판정과 touch cancel을 만들 수 없는 제약을 추가했다.
