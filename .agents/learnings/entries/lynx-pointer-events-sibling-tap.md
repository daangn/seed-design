---
id: lynx-pointer-events-sibling-tap
description: "PlayLynx 기기에서 agent-lynx `tap`이 FieldButton(이전 이름 InputButton)처럼 `pointer-events: none`인 형제 view가 위를 덮은 버튼을 `Ref @eN is covered ... hit node A, expected B`로 거부할 때 읽는다. snapshot ref 대신 CDP touch 에뮬레이션으로 실제 hit-test를 거치게 하는 방법과 눌림 상태를 class로 확인하는 방법을 다룬다. 덮는 요소가 버튼의 자손(loading indicator 등)이면 lynx-loading-tap-device-check를 본다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-loading-tap-device-check"]
---

# pointer-events: none 형제가 덮은 버튼은 CDP touch로 탭한다

## 교훈과 다음 행동

- `agent-lynx tap`은 ref 중심 좌표의 hit node가 ref 자신이나 자손이 아니면 거부한다. CSS `pointer-events: none`은 고려하지 않으므로 실제 기기에서는 탭이 버튼으로 전달되는 구조도 거부된다.
- 버튼 영역 중 형제 content와 겹치는 좌표에 CDP touch를 보낸다. native hit-test가 `pointer-events: none`을 건너뛰어 버튼이 이벤트를 받는다.

```bash
A="--client $CLIENT_ID --session $SESSION_ID"
for t in mousePressed mouseReleased; do
  bunx agent-lynx cdp $A --method Input.emulateTouchFromMouseEvent \
    "{\"type\":\"$t\",\"x\":120,\"y\":437,\"button\":\"left\",\"clickCount\":1}"
done
```

- 눌림 상태는 `mousePressed`만 보낸 뒤 `DOM.getDocument '{"depth":-1}'`에서 버튼 class의 `pressed_true`를 읽고, `mouseReleased` 뒤 `pressed_false`를 확인한다. Main Thread Scale Feedback이 Background로 눌림 상태를 넘기는 경로를 기기에서 확인할 수 있다.

## 발생 근거와 적용 조건

- DES-2637에서 iOS PlayLynx(SDK 1.4.0)로 `docs/examples/lynx/field-button/clear-button`(당시 경로 `input-button/clear-button`) 예제를 검증했다. FieldButton Root는 Button과 Content Scale용 content view를 형제로 두고, `seed-field-button__content`(당시 `seed-input-button__content`)에 `pointer-events: none`을 준다(`packages/lynx-css/recipes/field-button.css`).
- `agent-lynx tap @e8`(Button)은 `Ref @e8 is covered: (195,437) hit node 32, expected 21`로 거부됐다. 같은 좌표 근처에 `Input.emulateTouchFromMouseEvent`를 보내자 Button `bindtap`이 실행돼 값이 바뀌었고, 누르는 동안 `pressed_true`, 놓은 뒤 `pressed_false`였다.
- 피할 패턴: 거부된 tap을 "tap이 막혔다"로 판정하는 것.

## 변경 이력

- 2026-10-01: DES-2637 기기 검증에서 처음 기록했다.
- 2026-10-01: Lynx `InputButton`이 `FieldButton`으로 이름이 바뀌어 컴포넌트명과 예제 경로를 갱신했다.
- 2026-10-08: DES-2731에서 Lynx Recipe·class 이름이 `field-button`으로 바뀌어 class와 Recipe 경로를 갱신했다. 기기 재검증은 하지 않았다.
