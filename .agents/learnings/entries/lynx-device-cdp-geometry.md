---
id: lynx-device-cdp-geometry
description: PlayLynx 기기에서 agent-lynx CDP로 Lynx 컴포넌트의 크기·CSS 변수·transition·ref 측정값을 판정할 때 읽는다. `DOM.getBoxModel`의 `width`가 화면 크기보다 작게 나오거나, ref `boundingClientRect` 값이 DOM 크기와 조금 다르거나, 200ms 안팎의 transition·첫 프레임을 CDP 폴링으로 잡으려 할 때 적용한다. tap 대상 선택(loading overlay)이나 drag 입력에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-loading-tap-device-check", "lynx-headless-tree-parity"]
verified_at: "2026-09-29"
---

# 기기 CDP 측정은 border quad·style attribute·최종 상태로 판정한다

## 교훈과 다음 행동

- `DOM.getBoxModel`의 `width`·`height`는 content box다. 렌더된 크기는 `border` quad의 좌우·상하 차이로 계산한다.
- inline CSS 변수(예: `--fab-label-width`)는 `DOM.getDocument` 결과 node의 `style` attribute에 그대로 보인다. 측정 대상 자식의 border 폭과 비교한다.
- transition 설정은 `CSS.getComputedStyleForNode`의 `transition` 값으로 확인한다. agent-lynx 호출 하나가 0.5–1초 걸리므로 200ms transition의 중간 프레임과 reload 직후 첫 프레임은 폴링으로 잡히지 않는다 → 입력 전후의 최종 상태만 기기로 판정하고, 첫 렌더 gate처럼 짧은 구간은 단위 테스트의 class 전이로 확인한 뒤 기기 첫 프레임을 `미확인`으로 보고한다.
- Scale Feedback이 붙은 요소의 tap handler에서 ref `boundingClientRect`를 호출하면 눌림 scale이 적용된 값을 돌려준다. ref 대상 확인은 border 크기와의 가로·세로 비율이 같은지로 판정한다.
- 검증용 임시 예제를 `docs/examples/lynx/<component>/`에 두면 `lynx-spa` build의 lazy bundle과 `example` query로 바로 열린다. 판정 뒤 삭제한다.

## 발생 근거와 적용 조건

- 상황(DES-2618): iOS PlayLynx(sdk 1.4.0)에서 FloatingActionButton preview의 root `getBoxModel.width`가 121, label 폭이 101이었다. 임시 예제의 root는 `width` 46.5였지만 `border` quad는 82.5×48이었다.
- 같은 root의 ref `boundingClientRect`를 tap handler에서 호출하자 81.26×47.28이 나왔다. 가로·세로 모두 border 크기의 0.985배여서 눌림 scale 중 측정한 root임을 확인했다.
- root `style`은 `--fab-label-width:101px`(preview), `73.5px`(extended)로 label 폭과 같았다. computed `transition`에는 `width .2s`가 있었지만 tap 뒤 첫 샘플(0.54초)은 이미 최종 폭이었다.
- 피할 패턴: content box `width`를 렌더 크기로 보고 실패로 판정하는 것. 폴링 샘플에 중간값이 없다는 이유로 transition이 없다고 판정하는 것.

## 변경 이력

- 2026-09-29: DES-2618 FloatingActionButton 기기 검증에서 기록했다. 검증 범위는 iOS PlayLynx의 preview·extended 문서 예제와 임시 disabled/ref 장면이다.
